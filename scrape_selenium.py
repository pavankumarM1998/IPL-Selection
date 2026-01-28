from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import json
import time

def scrape_cricbuzz_squads():
    print("Starting automated squad extraction...\n")
    
    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    
    try:
        driver = webdriver.Chrome(options=chrome_options)
        driver.get('https://www.cricbuzz.com/cricket-series/11253/icc-mens-t20-world-cup-2026/squads')
        
        print("✓ Page loaded")
        
        # Wait for page to load
        time.sleep(3)
        
        # Get team names
        teams = driver.find_elements(By.CSS_SELECTOR, '.cb-col-25 span')
        team_names = [t.text.strip() for t in teams if len(t.text.strip()) > 2][:10]
        
        print(f"✓ Found {len(team_names)} teams\n")
        
        all_squads = {}
        
        for team_name in team_names:
            print(f"Extracting {team_name}...")
            
            # Click team
            team_element = driver.find_element(By.XPATH, f"//span[text()='{team_name}']")
            team_element.click()
            time.sleep(2)
            
            # Extract players
            players = []
            player_elements = driver.find_elements(By.CSS_SELECTOR, '.cb-col-84 .cb-font-16, .cb-col-84 .cb-font-14')
            
            for elem in player_elements:
                text = elem.text.strip()
                if text and len(text) > 2 and 'BATTER' not in text and 'BOWLER' not in text:
                    players.append(text)
            
            # Remove duplicates
            players = list(dict.fromkeys(players))
            
            if players:
                all_squads[team_name] = players
                print(f"  ✓ {len(players)} players\n")
            else:
                print(f"  ✗ No players found\n")
        
        driver.quit()
        
        # Save results
        with open('scraped_squads.json', 'w') as f:
            json.dump(all_squads, f, indent=2)
        
        print("✓ Squads saved to scraped_squads.json")
        
        # Generate JS file
        generate_js_file(all_squads)
        
        return all_squads
        
    except Exception as e:
        print(f"✗ Error: {e}")
        return None

def generate_js_file(squads):
    team_config = {
        'India': {'id': 'ind', 'short': 'IND', 'color': '#0055A6'},
        'Pakistan': {'id': 'pak', 'short': 'PAK', 'color': '#01411C'},
        'Australia': {'id': 'aus', 'short': 'AUS', 'color': '#FFD700'},
        'England': {'id': 'eng', 'short': 'ENG', 'color': '#CE1124'},
        'South Africa': {'id': 'sa', 'short': 'SA', 'color': '#007A4D'},
        'New Zealand': {'id': 'nz', 'short': 'NZ', 'color': '#000000'},
        'West Indies': {'id': 'wi', 'short': 'WI', 'color': '#7B0046'},
        'Sri Lanka': {'id': 'sl', 'short': 'SL', 'color': '#000080'},
        'Bangladesh': {'id': 'ban', 'short': 'BAN', 'color': '#006A4E'},
        'Afghanistan': {'id': 'afg', 'short': 'AFG', 'color': '#006400'}
    }
    
    js_content = '// T20 World Cup 2026 - OFFICIAL SQUADS (Auto-scraped from Cricbuzz)\n\n'
    js_content += 'const wcTeams = [\n'
    
    for team_name, players in squads.items():
        config = team_config.get(team_name, {'id': team_name[:3].lower(), 'short': team_name[:3].upper(), 'color': '#000000'})
        
        js_content += f'    {{\n'
        js_content += f'        id: "{config["id"]}",\n'
        js_content += f'        name: "{team_name}",\n'
        js_content += f'        shortName: "{config["short"]}",\n'
        js_content += f'        color: "{config["color"]}",\n'
        js_content += f'        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/320px-Flag_of_India.svg.png",\n'
        js_content += f'        players: [\n'
        
        for i, player in enumerate(players):
            role = guess_role(player)
            js_content += f'            {{ id: "{config["id"]}{i+1}", name: "{player}", role: "{role}" }},\n'
        
        js_content += f'        ]\n'
        js_content += f'    }},\n'
    
    js_content += '];\n\nconst wcConfig = { maxOverseas: 15, totalBudget: 100 };\n'
    
    with open('wc_data.js', 'w') as f:
        f.write(js_content)
    
    print("✓ Updated wc_data.js with scraped squads!\n")

def guess_role(name):
    n = name.lower()
    if any(x in n for x in ['pant', 'samson', 'rizwan', 'klaasen', 'buttler', 'pooran', 'mendis', 'gurbaz', 'inglis', 'wade', 'hope', 'das']):
        return 'wicketkeeper'
    elif any(x in n for x in ['bumrah', 'arshdeep', 'siraj', 'kuldeep', 'bishnoi', 'afridi', 'rabada', 'starc', 'boult', 'rashid', 'pathirana', 'mustafiz', 'zampa', 'wood', 'archer', 'hazlewood', 'cummins', 'nortje', 'ngidi', 'joseph', 'farooqi']):
        return 'bowler'
    elif any(x in n for x in ['pandya', 'jadeja', 'axar', 'sundar', 'marsh', 'maxwell', 'curran', 'hasaranga', 'shakib', 'santner', 'holder', 'russell', 'stoinis', 'green', 'jansen']):
        return 'all-rounder'
    return 'batsman'

if __name__ == '__main__':
    scrape_cricbuzz_squads()
