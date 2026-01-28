import re

# Foreign players mapping
foreign_players = {
    # CSK
    'Dewald Brewis': 'RSA', 'Noor Ahmad': 'AFG', 'Nathan Ellis': 'AUS',
    'Jamie Overton': 'ENG', 'Akeal Hosein': 'WI', 'Matt Henry': 'NZ',
    'Matthew Short': 'AUS', 'Zak Foulkes': 'NZ',
    
    # DC
    'Tristan Stubbs': 'RSA', 'Mitchell Starc': 'AUS', 'Dushmantha Chameera': 'SL',
    'Pathum Nissanka': 'SL', 'David Miller': 'RSA', 'Ben Duckett': 'ENG',
    'Lungi Ngidi': 'RSA', 'Kyle Jamieson': 'NZ',
    
    # GT
    'Rashid Khan': 'AFG', 'Jos Buttler': 'ENG', 'Glenn Phillips': 'NZ',
    'Kagiso Rabada': 'RSA', 'Jason Holder': 'WI', 'Tom Banton': 'ENG',
    'Luke Wood': 'ENG',
    
    # KKR
    'Sunil Narine': 'WI', 'Andre Russell': 'WI', 'Rovman Powell': 'WI',
    'Rachin Ravindra': 'NZ', 'Finn Allen': 'NZ', 'Tim Seifert': 'NZ',
    'Mustafizur Rahman': 'BAN', 'Cameron Green': 'AUS', 'Matheesha Pathirana': 'SL',
    
    # LSG
    'Nicholas Pooran': 'WI', 'Aiden Markram': 'RSA', 'Matthew Breetzke': 'RSA',
    'Shamar Joseph': 'WI', 'Mitchell Marsh': 'AUS', 'Gerald Coetzee': 'RSA',
    
    # MI
    'Trent Boult': 'NZ', 'Will Jacks': 'ENG', 'Ryan Rickleton': 'RSA',
    'Mitchell Santner': 'NZ', 'Corbin Bosch': 'RSA', 'Allah Ghafanzar': 'AFG',
    'Sherfane Rutherford': 'WI', 'Quinton de Kock': 'RSA',
    
    # PBKS
    'Marcus Stoinis': 'AUS', 'Marco Jansen': 'RSA', 'Lockie Ferguson': 'NZ',
    'Xavier Bartlett': 'AUS', 'Azmatullah Omarzai': 'AFG', 'Mitch Owen': 'AUS',
    'Ben Dwarshuis': 'AUS', 'Cooper Connolly': 'AUS',
    
    # RR
    'Jofra Archer': 'ENG', 'Shimron Hetmyer': 'WI', 'Lhuan-Dre Pretorius': 'RSA',
    'Kwena Maphaka': 'RSA', 'Nandre Burger': 'RSA', 'Sam Curran': 'ENG',
    'Maheesh Theekshana': 'SL', 'Adam Zampa': 'AUS', 'Fazalhaq Farooqi': 'AFG',
    'Wanindu Hasaranga': 'SL',
    
    # RCB
    'Phil Salt': 'ENG', 'Tim David': 'AUS', 'Romario Shepherd': 'WI',
    'Josh Hazlewood': 'AUS', 'Jacob Bethell': 'ENG', 'Nuwan Thushara': 'SL',
    'Jacob Duffy': 'NZ', 'Jordan Cox': 'ENG',
    
    # SRH
    'Pat Cummins': 'AUS', 'Travis Head': 'AUS', 'Heinrich Klaasen': 'RSA',
    'Brydon Carse': 'ENG', 'Kamindu Mendis': 'SL', 'Liam Livingstone': 'ENG',
    'Jack Edwards': 'AUS'
}

# Read the file
with open('data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Function to add nationality to a player line
def add_nationality(match):
    line = match.group(0)
    
    # Extract player name
    name_match = re.search(r"name: '([^']+)'", line)
    if not name_match:
        return line
    
    player_name = name_match.group(1)
    
    # Check if nationality already exists
    if 'nationality:' in line:
        return line
    
    # Determine nationality
    nationality = foreign_players.get(player_name, 'IND')
    
    # Add nationality before the closing brace
    modified_line = line.replace(' }', f", nationality: '{nationality}' }}")
    
    return modified_line

# Pattern to match player objects
player_pattern = r"\{ id: '[^']+', name: '[^']+', role: '[^']+' \}"

# Replace all player objects
modified_content = re.sub(player_pattern, add_nationality, content)

# Write back
with open('data.js', 'w', encoding='utf-8') as f:
    f.write(modified_content)

print("Successfully added nationality to all players!")
print(f"   - {len(foreign_players)} foreign players identified")
print(f"   - All other players marked as IND (Indian)")
