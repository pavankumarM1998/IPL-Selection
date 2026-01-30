
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import datetime
import time
import json

# Selenium Imports
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

# --- CONFIGURATION ---
SERVICE_ACCOUNT_FILE = 'cricket-ipl-selector-firebase-adminsdk-fbsvc-21d6f32167.json'
DATABASE_URL = 'https://cricket-ipl-selector-default-rtdb.firebaseio.com'

# Team Config for ID mapping
TEAM_CONFIG = {
    'India': {'id': 'ind', 'short': 'IND', 'color': '#0055A6', 'logo': 'assets/ind.png'},
    'Pakistan': {'id': 'pak', 'short': 'PAK', 'color': '#01411C', 'logo': 'assets/pak.png'},
    'Australia': {'id': 'aus', 'short': 'AUS', 'color': '#FFD700', 'logo': 'assets/aus.png'},
    'England': {'id': 'eng', 'short': 'ENG', 'color': '#CE1124', 'logo': 'assets/eng.png'},
    'South Africa': {'id': 'sa', 'short': 'SA', 'color': '#007A4D', 'logo': 'assets/sa.png'},
    'New Zealand': {'id': 'nz', 'short': 'NZ', 'color': '#000000', 'logo': 'assets/nz.png'},
    'West Indies': {'id': 'wi', 'short': 'WI', 'color': '#7B0046', 'logo': 'assets/wi.png'},
    'Sri Lanka': {'id': 'sl', 'short': 'SL', 'color': '#000080', 'logo': 'assets/sl.png'},
    'Bangladesh': {'id': 'ban', 'short': 'BAN', 'color': '#006A4E', 'logo': 'assets/ban.png'},
    'Afghanistan': {'id': 'afg', 'short': 'AFG', 'color': '#006400', 'logo': 'assets/afg.png'}
}

# Initialize Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_FILE)
    firebase_admin.initialize_app(cred, {
        'databaseURL': DATABASE_URL
    })

def log(msg):
    print(f"[{datetime.datetime.now()}] {msg}")

def guess_role(name):
    n = name.lower()
    if any(x in n for x in ['pant', 'samson', 'rizwan', 'klaasen', 'buttler', 'pooran', 'mendis', 'gurbaz', 'inglis', 'wade', 'hope', 'das']):
        return 'wicketkeeper'
    elif any(x in n for x in ['bumrah', 'arshdeep', 'siraj', 'kuldeep', 'bishnoi', 'afridi', 'rabada', 'starc', 'boult', 'rashid', 'pathirana', 'mustafiz', 'zampa', 'wood', 'archer', 'hazlewood', 'cummins', 'nortje', 'ngidi', 'joseph', 'farooqi']):
        return 'bowler'
    elif any(x in n for x in ['pandya', 'jadeja', 'axar', 'sundar', 'marsh', 'maxwell', 'curran', 'hasaranga', 'shakib', 'santner', 'holder', 'russell', 'stoinis', 'green', 'jansen']):
        return 'all-rounder'
    return 'batsman'

def scrape_latest_squads():
    """
    Real Selenium Scraper for Cricbuzz
    """
    log("📡 Scraper: Initializing Selenium...")
    
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    # Suppress logging
    chrome_options.add_argument('--log-level=3') 
    
    driver = None
    try:
        driver = webdriver.Chrome(options=chrome_options)
        url = 'https://www.cricbuzz.com/cricket-series/11253/icc-mens-t20-world-cup-2026/squads'
        log(f"📡 Navigating to {url}...")
        driver.get(url)
        
        # Wait for page load
        time.sleep(3)
        
        # Find teams
        teams_found = driver.find_elements(By.CSS_SELECTOR, '.cb-col-25 span')
        team_names = [t.text.strip() for t in teams_found if len(t.text.strip()) > 2][:10]
        
        log(f"found {len(team_names)} teams.")
        
        full_db_teams = {}
        
        for team_name in team_names:
            log(f"   Processing {team_name}...")
            
            # Click team to load players
            try:
                team_element = driver.find_element(By.XPATH, f"//span[text()='{team_name}']")
                team_element.click()
                time.sleep(1) # Wait for AJAX
                
                # Extract player names
                player_elements = driver.find_elements(By.CSS_SELECTOR, '.cb-col-84 .cb-font-16, .cb-col-84 .cb-font-14')
                raw_players = []
                for elem in player_elements:
                    text = elem.text.strip()
                    if text and len(text) > 2 and 'BATTER' not in text and 'BOWLER' not in text:
                        raw_players.append(text)
                
                # Deduplicate
                raw_players = list(dict.fromkeys(raw_players))
                
                # Transform to DB Schema
                config = TEAM_CONFIG.get(team_name, {'id': team_name[:3].lower(), 'short': team_name[:3].upper(), 'color': '#333'})
                
                players_map = {}
                for i, p_name in enumerate(raw_players):
                    p_id = f"{config['id']}{i+1}"
                    players_map[p_id] = {
                        "id": p_id,
                        "name": p_name,
                        "role": guess_role(p_name),
                        "nationality": config['short'] # Simple assumption
                    }
                
                full_db_teams[config['id']] = {
                    "id": config['id'],
                    "name": team_name,
                    "shortName": config['short'],
                    "color": config['color'],
                    "logo": config.get('logo', ''),
                    "players": players_map
                }
                
            except Exception as e:
                log(f"   ⚠️ Error processing {team_name}: {e}")
                continue

        return full_db_teams

    except Exception as e:
        log(f"❌ Scrape Error: {e}")
        return None
    finally:
        if driver:
            driver.quit()

def scrape_latest_matches():
    # Placeholder for match scraping
    return None

def update_database():
    log("🚀 Starting Daily Update...")
    
    # 1. Fetch Data
    new_teams = scrape_latest_squads()
    new_matches = scrape_latest_matches()

    # 2. Update Teams if found
    if new_teams and len(new_teams) > 0:
        log(f"Found updates for {len(new_teams)} teams. Updating DB...")
        db.reference('teams').set(new_teams)
        log("✅ Teams updated.")
    else:
        log("ℹ️ No team data fetched (or error occurred).")

    # 3. Update Matches if found
    if new_matches:
         log(f"Found updates for {len(new_matches)} matches. Updating DB...")
         db.reference('matches').set(new_matches)
         log("✅ Matches updated.")
    
    # 4. Update 'last_updated' timestamp metadata
    db.reference('metadata/last_updated').set(str(datetime.datetime.now()))
    log("✅ Update process finished.")

if __name__ == '__main__':
    try:
        update_database()
    except Exception as e:
        log(f"❌ Critical Error: {e}")
