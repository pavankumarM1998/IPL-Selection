from bs4 import BeautifulSoup
import re
import json

# Read the saved HTML
with open('cricbuzz_squads.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Extract JSON data from script tags
json_pattern = r'window\.__INITIAL_STATE__\s*=\s*({.*?});'
match = re.search(json_pattern, html_content, re.DOTALL)

if match:
    try:
        data = json.loads(match.group(1))
        print("✓ Found INITIAL_STATE data")
        
        # Save for inspection
        with open('initial_state.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print("✓ Saved to initial_state.json")
        
    except Exception as e:
        print(f"Error parsing JSON: {e}")
else:
    # Try alternative pattern
    print("Trying alternative extraction...")
    
    # Look for squad data patterns
    squad_pattern = r'"squad.*?players.*?\[(.*?)\]'
    matches = re.findall(squad_pattern, html_content, re.DOTALL)
    
    if matches:
        print(f"✓ Found {len(matches)} squad patterns")
        for i, match in enumerate(matches[:3]):
            print(f"\nSquad {i+1} snippet:")
            print(match[:200])
    else:
        print("✗ No squad patterns found")
        
        # Last resort: extract all JSON-like structures
        json_objects = re.findall(r'\{[^{}]*"player[^{}]*\}', html_content)
        if json_objects:
            print(f"\n✓ Found {len(json_objects)} JSON objects with 'player'")
            print("First object:")
            print(json_objects[0][:300])
