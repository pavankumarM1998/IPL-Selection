
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import json
import os

# Initialize Firebase Admin
cred = credentials.Certificate('cricket-ipl-selector-firebase-adminsdk-fbsvc-21d6f32167.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://cricket-ipl-selector-default-rtdb.firebaseio.com'
})

def migrate():
    print("🚀 Starting Migration via Admin SDK...")

    # Load Teams
    try:
        with open('data.json', 'r', encoding='utf-8') as f:
            ipl_data = json.load(f)
            teams_array = ipl_data.get('teams', [])
            
            # Convert Array to Object (Keyed by ID)
            teams_obj = {}
            for team in teams_array:
                # Process players object
                players_obj = {}
                for player in team.get('players', []):
                    players_obj[player['id']] = {
                        'id': player['id'],
                        'name': player['name'],
                        'role': player['role'],
                        'nationality': player.get('nationality', 'IND')
                    }
                
                teams_obj[team['id']] = {
                    'id': team['id'],
                    'name': team['name'],
                    'shortName': team['shortName'],
                    'color': team['color'],
                    'logo': team['logo'],
                    'players': players_obj
                }
            
            # Upload Teams
            print(f"Uploading {len(teams_obj)} teams...")
            db.reference('teams').set(teams_obj)
            print("✅ Teams uploaded successfully")

    except Exception as e:
        print(f"❌ Error migrating teams: {e}")

    # Load Matches
    try:
        with open('matches.json', 'r', encoding='utf-8') as f:
            matches_data = json.load(f)
            matches_array = matches_data.get('matches', [])
            
            # Convert Array to Object
            matches_obj = {}
            for match in matches_array:
                matches_obj[f"match-{match['id']}"] = match
            
            # Upload Matches
            print(f"Uploading {len(matches_obj)} matches...")
            db.reference('matches').set(matches_obj)
            print("✅ Matches uploaded successfully")

    except Exception as e:
        print(f"❌ Error migrating matches: {e}")

if __name__ == '__main__':
    migrate()
