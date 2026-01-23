import requests
from bs4 import BeautifulSoup
import json
import time

# URL for T20 World Cup 2026 squads
url = "https://www.cricbuzz.com/cricket-series/11253/icc-mens-t20-world-cup-2026/squads"

# Teams to extract
teams = ["India", "Pakistan", "Australia", "England", "South Africa", 
         "New Zealand", "West Indies", "Sri Lanka", "Bangladesh", "Afghanistan"]

# Headers to mimic browser
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

all_squads = {}

try:
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Save the HTML for inspection
    with open('cricbuzz_page.html', 'w', encoding='utf-8') as f:
        f.write(soup.prettify())
    
    print("Page downloaded successfully!")
    print("HTML saved to cricbuzz_page.html")
    print("\nPlease check the HTML file to identify the correct selectors for squad data.")
    
except Exception as e:
    print(f"Error: {e}")
