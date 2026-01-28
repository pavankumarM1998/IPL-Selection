import requests
import json

# Direct API approach for Cricbuzz
url = "https://www.cricbuzz.com/cricket-series/11253/icc-mens-t20-world-cup-2026/squads"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive',
}

try:
    response = requests.get(url, headers=headers, timeout=15)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        # Save the HTML
        with open('cricbuzz_squads.html', 'w', encoding='utf-8') as f:
            f.write(response.text)
        print("✓ HTML saved to cricbuzz_squads.html")
        
        # Now parse it
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find squad data - looking for player names
        players = soup.find_all('div', class_='cb-col-84')
        
        if players:
            print(f"\n✓ Found {len(players)} player sections")
            
            # Extract text from first few to see structure
            for i, player in enumerate(players[:5]):
                print(f"\nPlayer {i+1}:")
                print(player.get_text(strip=True)[:200])
        else:
            print("\n✗ No player data found with class 'cb-col-84'")
            
            # Try alternative selectors
            all_text = soup.get_text()
            if 'India' in all_text:
                print("✓ Page contains 'India' - data is there")
                
                # Save snippet for analysis
                with open('page_snippet.txt', 'w', encoding='utf-8') as f:
                    f.write(all_text[:5000])
                print("✓ Saved page snippet to page_snippet.txt")
    else:
        print(f"✗ Failed with status {response.status_code}")
        
except Exception as e:
    print(f"✗ Error: {e}")
