import requests
from bs4 import BeautifulSoup
import json
import re

def scrape_espncricinfo_squads():
    """Scrape T20 World Cup 2026 squads from ESPNcricinfo"""
    
    # ESPNcricinfo T20 World Cup 2026 URL
    base_url = "https://www.espncricinfo.com/series/icc-men-s-t20-world-cup-2026"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    teams = {
        "India": "ind",
        "Pakistan": "pak",
        "Australia": "aus",
        "England": "eng",
        "South Africa": "sa",
        "New Zealand": "nz",
        "West Indies": "wi",
        "Sri Lanka": "sl",
        "Bangladesh": "ban",
        "Afghanistan": "afg"
    }
    
    all_squads = {}
    
    try:
        # Try multiple sources
        sources = [
            "https://www.espncricinfo.com/series/icc-men-s-t20-world-cup-2026/squads",
            "https://www.icc-cricket.com/tournaments/t20-world-cup/2026/squads",
            "https://sports.ndtv.com/cricket/t20-world-cup-2026-squads"
        ]
        
        for source in sources:
            try:
                response = requests.get(source, headers=headers, timeout=10)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')
                    
                    # Save HTML for inspection
                    with open(f'squad_source_{sources.index(source)}.html', 'w', encoding='utf-8') as f:
                        f.write(soup.prettify())
                    
                    print(f"✓ Downloaded from {source}")
                    
            except Exception as e:
                print(f"✗ Failed {source}: {e}")
                continue
        
        print("\nHTML files saved. Analyzing structure...")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    scrape_espncricinfo_squads()
