"""
IPL 2026 Daily Auto-Updater
============================
- Scrapes IPL 2026 squad data from Cricbuzz (uses requests + BeautifulSoup, no Selenium needed)
- Auto-updates match statuses (completed / live / upcoming) from the fixed schedule
- Writes updated data back to data.js and matches.js
- Also pushes to Firebase Realtime Database (optional, skipped gracefully if auth fails)

Schedule: Run daily via Windows Task Scheduler (setup_auto_update.ps1)
"""

import os
import sys
import json
import datetime
import re
import time
import logging

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(BASE_DIR, "daily_update.log")

import io

_file_handler   = logging.FileHandler(LOG_FILE, encoding="utf-8")
_stream_handler = logging.StreamHandler(io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace"))

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s  %(message)s",
    handlers=[_file_handler, _stream_handler],
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Dependencies check
# ---------------------------------------------------------------------------
try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    log.error("Missing dependencies. Run:  pip install requests beautifulsoup4")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
DATA_JS       = os.path.join(BASE_DIR, "data.js")
MATCHES_JS    = os.path.join(BASE_DIR, "matches.js")
DATA_JSON     = os.path.join(BASE_DIR, "data.json")
MATCHES_JSON  = os.path.join(BASE_DIR, "matches.json")

# Cricbuzz IPL 2026 series page (update series ID if needed each season)
# Series 9237 = IPL 2026 (verify at https://www.cricbuzz.com/cricket-series/9237/...)
CRICBUZZ_SQUADS_URL = "https://www.cricbuzz.com/cricket-series/9237/indian-premier-league-2026/squads"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

# IPL team mapping: Cricbuzz name → app config
TEAM_CONFIG = {
    "Chennai Super Kings":        {"id": "csk",  "shortName": "CSK",  "color": "#FDB913", "logo": "https://documents.iplt20.com/ipl/CSK/Logos/Logooutline/CSKoutline.png"},
    "Delhi Capitals":             {"id": "dc",   "shortName": "DC",   "color": "#004C93", "logo": "https://documents.iplt20.com/ipl/DC/Logos/LogoOutline/DCoutline.png"},
    "Gujarat Titans":             {"id": "gt",   "shortName": "GT",   "color": "#1C2F4C", "logo": "https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png"},
    "Kolkata Knight Riders":      {"id": "kkr",  "shortName": "KKR",  "color": "#3A225D", "logo": "https://documents.iplt20.com/ipl/KKR/Logos/Logooutline/KKRoutline.png"},
    "Lucknow Super Giants":       {"id": "lsg",  "shortName": "LSG",  "color": "#00A1E4", "logo": "https://documents.iplt20.com/ipl/LSG/Logos/Logooutline/LSGoutline.png"},
    "Mumbai Indians":             {"id": "mi",   "shortName": "MI",   "color": "#004BA0", "logo": "https://documents.iplt20.com/ipl/MI/Logos/Logooutline/MIoutline.png"},
    "Punjab Kings":               {"id": "pbks", "shortName": "PBKS", "color": "#ED1B24", "logo": "https://documents.iplt20.com/ipl/PBKS/Logos/Logooutline/PBKSoutline.png"},
    "Rajasthan Royals":           {"id": "rr",   "shortName": "RR",   "color": "#EA1A85", "logo": "https://documents.iplt20.com/ipl/RR/Logos/Logooutline/RRoutline.png"},
    "Royal Challengers Bengaluru":{"id": "rcb",  "shortName": "RCB",  "color": "#EC1C24", "logo": "https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png"},
    "Royal Challengers Bangalore":{"id": "rcb",  "shortName": "RCB",  "color": "#EC1C24", "logo": "https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png"},
    "Sunrisers Hyderabad":        {"id": "srh",  "shortName": "SRH",  "color": "#FF822A", "logo": "https://documents.iplt20.com/ipl/SRH/Logos/Logooutline/SRHoutline.png"},
}

# Role keyword heuristics
WICKETKEEPER_KEYWORDS = [
    "dhoni", "pant", "samson", "pooran", "buttler", "klaasen", "de kock",
    "kishan", "inglis", "wade", "gurbaz", "jurel", "rahul kl", "kl rahul",
    "abishek porel", "prabhsimran", "urvil", "anuj rawat", "aryan juyal",
    "robin minz", "ryan rickleton", "mayank rawat", "quinton", "phil salt",
    "jitesh", "jordan cox", "fin allen", "finn allen", "tim seifert",
    "anuj rawat", "kumar kushagra", "tom banton", "vishnu vinod",
]
BOWLER_KEYWORDS = [
    "bumrah", "arshdeep", "siraj", "kuldeep", "bishnoi", "rabada", "starc",
    "boult", "rashid", "pathirana", "mustafiz", "zampa", "wood", "archer",
    "hazlewood", "cummins", "nortje", "ngidi", "farooqi", "noor ahmad",
    "harshal", "chahal", "natarajan", "mukesh kumar", "chameera", "unadkat",
    "umran", "vaibhav arora", "akash deep", "mavi", "yash dayal", "thushara",
    "rasikh", "suyash", "theo", "matheesha", "kwena", "nandre burger",
    "lockie", "xavier bartlett", "avinash", "dwarshuis", "vyshak",
    "shardul thakur", "mavi", "deepak chahar", "ashley", "anshul kamboj",
    "gurjapneet", "rahul chahar", "nathan ellis", "matt henry", "avesh",
    "coetzee", "shamar joseph", "mohsin", "mayank yadav", "digvesh",
    "prasidh", "gurnoor", "manav", "sai kishore", "luke wood",
    "mukesh choudhary", "fergus", "vicky ostwal", "mangesh", "jacob duffy",
    "tushar deshpande", "sandeep sharma", "yudhvir", "maphaka",
    "harshal patel", "jaydev", "shivam mavi", "zeeshan", "harsh dubey",
    "amit kumar", "smaran", "eshan malinga",
]
ALLROUNDER_KEYWORDS = [
    "pandya", "jadeja", "axar", "sundar", "marsh", "maxwell", "curran",
    "hasaranga", "shakib", "santner", "holder", "russell", "stoinis",
    "green", "jansen", "narine", "ramandeep", "anukul", "rachin",
    "washington sundar", "rahul tewatia", "nishant sindhu", "jason holder",
    "glenn phillips", "jayant yadav", "arshad khan", "rovman powell",
    "krunal", "venkatesh iyer", "jacob bethell", "romario shepherd",
    "riyan parag", "shubham dubey", "lhuan-dre", "pretorius", "sam curran",
    "wanindu", "abhishek sharma", "brydon carse", "kamindu mendis",
    "liam livingstone", "shivam dube", "aman khan", "akeal hosein",
    "zak foulkes", "jamie overton", "corbin bosch", "raj angad bawa",
    "sherfane rutherford", "naman dhir", "will jacks", "mitchell santner",
    "harpreet brar", "musheer", "marco jansen", "azmatullah", "suryansh",
    "cooper connolly", "mitch owen", "himmat singh", "abdul samad",
    "arshin", "mitchell marsh", "kayam", "praful hinge",
]


def guess_role(name: str) -> str:
    n = name.lower()
    if any(k in n for k in WICKETKEEPER_KEYWORDS):
        return "wicketkeeper"
    if any(k in n for k in BOWLER_KEYWORDS):
        return "bowler"
    if any(k in n for k in ALLROUNDER_KEYWORDS):
        return "all-rounder"
    return "batsman"


def guess_nationality(name: str, team_id: str) -> str:
    """Very simple nationality lookup by known player names."""
    foreign_players = {
        # AUS
        "pat cummins": "AUS", "travis head": "AUS", "mitchell starc": "AUS",
        "josh hazlewood": "AUS", "tim david": "AUS", "cameron green": "AUS",
        "matthew short": "AUS", "mitch owen": "AUS", "xavier bartlett": "AUS",
        "marcus stoinis": "AUS", "ben dwarshuis": "AUS", "cooper connolly": "AUS",
        "jack edwards": "AUS", "glenn phillips": "NZ", "tom banton": "ENG",
        # ENG
        "jos buttler": "ENG", "phil salt": "ENG", "jacob bethell": "ENG",
        "sam curran": "ENG", "jofra archer": "ENG", "ben duckett": "ENG",
        "will jacks": "ENG", "jamie overton": "ENG", "zak foulkes": "NZ",
        "matt henry": "NZ", "luke wood": "ENG", "kyle jamieson": "NZ",
        "liam livingstone": "ENG", "brydon carse": "ENG", "jordan cox": "ENG",
        # SA
        "kagiso rabada": "RSA", "heinrich klaasen": "RSA", "david miller": "RSA",
        "aiden markram": "RSA", "matthew breetzke": "RSA", "gerald coetzee": "RSA",
        "lhuan-dre pretorius": "RSA", "kwena maphaka": "RSA",
        "nandre burger": "RSA", "tristan stubbs": "RSA", "lungi ngidi": "RSA",
        "corbin bosch": "RSA", "ryan rickleton": "RSA", "dewald brewis": "RSA",
        # NZ
        "trent boult": "NZ", "mitchell santner": "NZ", "rachin ravindra": "NZ",
        "finn allen": "NZ", "tim seifert": "NZ", "lockie ferguson": "NZ",
        "adam zampa": "AUS",
        # WI
        "nicholas pooran": "WI", "rovman powell": "WI", "sunil narine": "WI",
        "shimron hetmyer": "WI", "jason holder": "WI", "romario shepherd": "WI",
        "sherfane rutherford": "WI", "akeal hosein": "WI", "shamar joseph": "WI",
        # AFG
        "rashid khan": "AFG", "noor ahmad": "AFG", "azmatullah omarzai": "AFG",
        "fazalhaq farooqi": "AFG", "allah ghafanzar": "AFG",
        # SL
        "wanindu hasaranga": "SL", "maheesh theekshana": "SL",
        "nuwan thushara": "SL", "kamindu mendis": "SL",
        "matheesha pathirana": "SL", "dushmantha chameera": "SL",
        "pathum nissanka": "SL",
        # BAN - none currently in IPL 2026
    }
    n = name.lower()
    for k, v in foreign_players.items():
        if k in n:
            return v
    return "IND"


# ---------------------------------------------------------------------------
# Part 1: Scrape IPL Squads
# ---------------------------------------------------------------------------

def fetch_page(url: str, retries: int = 3) -> str | None:
    for attempt in range(retries):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=20)
            if resp.status_code == 200:
                return resp.text
            log.warning(f"HTTP {resp.status_code} for {url} (attempt {attempt+1})")
        except Exception as e:
            log.warning(f"Request error: {e} (attempt {attempt+1})")
        time.sleep(3)
    return None


def scrape_ipl_squads() -> list | None:
    """
    Scrapes IPL 2026 squads from Cricbuzz.
    Returns a list of team dicts matching the data.js schema, or None on failure.
    """
    log.info("[NET] Fetching IPL squads from Cricbuzz...")
    html = fetch_page(CRICBUZZ_SQUADS_URL)
    if not html:
        log.error("[FAIL] Could not fetch Cricbuzz squads page.")
        return None

    soup = BeautifulSoup(html, "html.parser")

    # Find team blocks — Cricbuzz renders each team in a .cb-col-25 block
    # Each team has a heading and a list of player links
    teams_out = []
    processed_ids = set()

    # Try to find team sections; structure may vary slightly each season
    team_sections = soup.select("div.cb-col.cb-col-100.cb-bg-white")
    if not team_sections:
        # Fallback: look for squad list wrappers
        team_sections = soup.select("div.cb-squad-list-wrapper")

    if not team_sections:
        log.warning("⚠️ Could not find team sections in Cricbuzz HTML. Page structure may have changed.")
        return None

    for section in team_sections:
        # Team name
        name_el = section.select_one("h2.cb-col-100, div.cb-col-25 span, h3")
        if not name_el:
            continue
        team_name = name_el.get_text(strip=True)
        cfg = TEAM_CONFIG.get(team_name)
        if not cfg:
            # Try partial match
            for k, v in TEAM_CONFIG.items():
                if k.lower() in team_name.lower() or team_name.lower() in k.lower():
                    cfg = v
                    team_name = k
                    break
        if not cfg or cfg["id"] in processed_ids:
            continue

        # Player names
        player_els = section.select("a.cb-col-84, div.cb-col-84 a, a[href*='/cricket-player/']")
        if not player_els:
            continue

        players = []
        seen = set()
        for i, el in enumerate(player_els):
            pname = el.get_text(strip=True)
            if not pname or len(pname) < 3 or pname in seen:
                continue
            # Skip role headers like "BATTER", "BOWLER", etc.
            if pname.upper() == pname and len(pname) < 15:
                continue
            seen.add(pname)
            pid = f"{cfg['id']}-{i+1}"
            players.append({
                "id": pid,
                "name": pname,
                "role": guess_role(pname),
                "nationality": guess_nationality(pname, cfg["id"]),
            })

        if len(players) < 5:
            log.warning(f"[WARN] Only {len(players)} players found for {team_name} - skipping.")
            continue

        teams_out.append({
            "id":        cfg["id"],
            "name":      team_name,
            "shortName": cfg["shortName"],
            "color":     cfg["color"],
            "logo":      cfg["logo"],
            "players":   players,
        })
        processed_ids.add(cfg["id"])
        log.info(f"   [OK] {team_name}: {len(players)} players")

    if not teams_out:
        log.warning("[WARN] No teams scraped - Cricbuzz page structure may have changed.")
        return None

    log.info(f"[OK] Scraped {len(teams_out)} teams.")
    return teams_out


# ---------------------------------------------------------------------------
# Part 2: Update Match Statuses
# ---------------------------------------------------------------------------

def load_matches_from_js() -> list:
    """Parse the matches array from matches.js."""
    try:
        with open(MATCHES_JS, "r", encoding="utf-8") as f:
            content = f.read()
        # Extract the JSON-like array between the first [ and last ]
        start = content.index("[")
        end = content.rindex("]") + 1
        raw = content[start:end]

        # Convert JS object to valid JSON:
        # - Remove trailing commas before } or ]
        raw = re.sub(r",\s*([\}\]])", r"\1", raw)
        # - Wrap bare keys in quotes
        raw = re.sub(r'(?<!")(\b\w+\b)(?!")(\s*):', r'"\1"\2:', raw)
        # - Replace single-quoted strings with double quotes
        raw = raw.replace("'", '"')
        # - Remove JS comments
        raw = re.sub(r"//.*", "", raw)

        matches = json.loads(raw)
        return matches
    except Exception as e:
        log.warning(f"⚠️ Could not parse matches.js: {e} — using hardcoded schedule.")
        return []


def update_match_statuses(matches: list) -> list:
    """
    Mark each match as:
      - 'completed' if the match date is in the past
      - 'live'      if today is the match date and current time is within match window (~4 hrs)
      - 'upcoming'  otherwise
    Playoff TBD matches keep status 'upcoming'.
    """
    now = datetime.datetime.now()
    today = now.date()
    updated = 0

    for m in matches:
        if m.get("team1") == "TBD" or m.get("team2") == "TBD":
            continue  # Playoff — do not touch status

        try:
            match_date = datetime.date.fromisoformat(m["date"])
            match_time = datetime.time.fromisoformat(m.get("time", "19:30") + ":00")
            match_start = datetime.datetime.combine(match_date, match_time)
            match_end   = match_start + datetime.timedelta(hours=4)

            old_status = m.get("status", "upcoming")
            if now >= match_end:
                new_status = "completed"
            elif match_start <= now < match_end:
                new_status = "live"
            else:
                new_status = "upcoming"

            if old_status != new_status:
                m["status"] = new_status
                updated += 1
        except Exception as e:
            log.warning(f"   ⚠️ Could not process match {m.get('id')}: {e}")

    log.info(f"[OK] Match statuses updated ({updated} changes).")
    return matches


# ---------------------------------------------------------------------------
# Part 3: Write updated data.js and matches.js
# ---------------------------------------------------------------------------

def write_data_js(teams: list):
    """Write updated teams back to data.js."""
    teams_js = json.dumps(teams, indent=4, ensure_ascii=False)

    content = f"""// IPL 2026 Teams and Players Data - Auto-updated by daily_update.py
// Last updated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
const iplData = {{
    teams: {teams_js}
}};

// Role display names
const roleNames = {{
    'batsman': 'Batsman',
    'bowler': 'Bowler',
    'all-rounder': 'All-Rounder',
    'wicketkeeper': 'Wicketkeeper'
}};
"""
    with open(DATA_JS, "w", encoding="utf-8") as f:
        f.write(content)

    # Also keep a json copy
    with open(DATA_JSON, "w", encoding="utf-8") as f:
        json.dump({"teams": teams}, f, indent=2, ensure_ascii=False)

    log.info(f"[OK] data.js written ({len(teams)} teams).")


def write_matches_js(matches: list):
    """Write updated matches back to matches.js."""
    matches_js = json.dumps(matches, indent=8, ensure_ascii=False)

    content = f"""// IPL 2026 Match Schedule - Auto-updated by daily_update.py
// Last updated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

const iplMatches = {{
    matches: {matches_js}
}};
"""
    with open(MATCHES_JS, "w", encoding="utf-8") as f:
        f.write(content)

    # Also keep a json copy
    with open(MATCHES_JSON, "w", encoding="utf-8") as f:
        json.dump({"matches": matches}, f, indent=2, ensure_ascii=False)

    log.info(f"[OK] matches.js written ({len(matches)} matches).")


# ---------------------------------------------------------------------------
# Part 4: Optional Firebase push
# ---------------------------------------------------------------------------

def push_to_firebase(teams: list, matches: list):
    try:
        import firebase_admin
        from firebase_admin import credentials, db as rtdb

        SERVICE_ACCOUNT = os.path.join(BASE_DIR, "cricket-ipl-selector-firebase-adminsdk-fbsvc-21d6f32167.json")
        DATABASE_URL = "https://cricket-ipl-selector-default-rtdb.firebaseio.com"

        if not os.path.exists(SERVICE_ACCOUNT):
            log.info("[INFO] Firebase service account not found - skipping Firebase push.")
            return

        if not firebase_admin._apps:
            cred = credentials.Certificate(SERVICE_ACCOUNT)
            firebase_admin.initialize_app(cred, {"databaseURL": DATABASE_URL})

        # Convert lists to dicts keyed by id
        teams_dict   = {t["id"]: t for t in teams}
        matches_dict = {str(m["id"]): m for m in matches}

        rtdb.reference("teams").set(teams_dict)
        rtdb.reference("matches").set(matches_dict)
        rtdb.reference("metadata/last_updated").set(str(datetime.datetime.now()))
        log.info("[OK] Firebase Realtime Database updated.")

    except ImportError:
        log.info("[INFO] firebase-admin not installed - skipping Firebase push.")
    except Exception as e:
        log.warning(f"[WARN] Firebase push failed: {e}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    log.info("=" * 60)
    log.info("IPL 2026 Daily Update - Starting")
    log.info(f"   Time: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    log.info("=" * 60)

    # --- Load current data (always needed for matches) ---
    current_matches = load_matches_from_js()
    if not current_matches:
        log.warning("[WARN] Could not load matches from matches.js - match status update skipped.")

    # --- Step 1: Try to scrape updated squad data ---
    new_teams = scrape_ipl_squads()

    # If scraping fails, load existing teams from data.json as fallback
    if not new_teams:
        log.warning("[WARN] Squad scrape failed - keeping existing team data.")
        try:
            with open(DATA_JSON, "r", encoding="utf-8") as f:
                existing = json.load(f)
            new_teams = existing.get("teams", [])
            log.info(f"[INFO] Loaded {len(new_teams)} teams from existing data.json.")
        except Exception:
            new_teams = []

    # --- Step 2: Update match statuses ---
    if current_matches:
        updated_matches = update_match_statuses(current_matches)
        write_matches_js(updated_matches)
    else:
        updated_matches = []

    # --- Step 3: Write updated data.js ---
    if new_teams:
        write_data_js(new_teams)
    else:
        log.warning("[WARN] No team data available - data.js not updated.")

    # --- Step 4: Firebase push (optional) ---
    if new_teams and updated_matches:
        push_to_firebase(new_teams, updated_matches)

    log.info("=" * 60)
    log.info("[DONE] Daily update complete.")
    log.info("=" * 60)


if __name__ == "__main__":
    main()
