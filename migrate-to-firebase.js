// Firebase Data Migration Script
// This script migrates existing data from data.js and matches.js to Firebase Realtime Database
// Run this in the browser console after opening index.html

console.log('🔥 Starting Firebase Data Migration...');

// Wait for Firebase to be initialized
if (typeof firebaseDB === 'undefined') {
    console.error('❌ Firebase not initialized. Make sure firebase-config.js is loaded.');
} else {
    console.log('✅ Firebase initialized successfully');

    // Function to migrate teams and players
    function migrateTeamsData() {
        console.log('📊 Migrating teams and players data...');

        if (typeof iplData === 'undefined') {
            console.error('❌ iplData not found. Make sure data.js is loaded.');
            return;
        }

        const teamsRef = firebaseDB.ref('teams');

        // Convert teams array to object with team id as key
        const teamsObject = {};
        iplData.teams.forEach(team => {
            // Convert players array to object with player id as key
            const playersObject = {};
            team.players.forEach(player => {
                playersObject[player.id] = {
                    id: player.id,
                    name: player.name,
                    role: player.role
                };
            });

            teamsObject[team.id] = {
                id: team.id,
                name: team.name,
                shortName: team.shortName,
                color: team.color,
                logo: team.logo,
                players: playersObject
            };
        });

        // Upload to Firebase
        teamsRef.set(teamsObject)
            .then(() => {
                console.log('✅ Teams and players data migrated successfully!');
                console.log(`   - Migrated ${iplData.teams.length} teams`);
                const totalPlayers = iplData.teams.reduce((sum, team) => sum + team.players.length, 0);
                console.log(`   - Migrated ${totalPlayers} players`);
            })
            .catch((error) => {
                console.error('❌ Error migrating teams data:', error);
            });
    }

    // Function to migrate matches data
    function migrateMatchesData() {
        console.log('📅 Migrating matches data...');

        if (typeof iplMatches === 'undefined') {
            console.error('❌ iplMatches not found. Make sure matches.js is loaded.');
            return;
        }

        const matchesRef = firebaseDB.ref('matches');

        // Convert matches array to object with match id as key
        const matchesObject = {};
        iplMatches.matches.forEach(match => {
            matchesObject[`match-${match.id}`] = {
                id: match.id,
                matchNumber: match.matchNumber,
                date: match.date,
                time: match.time,
                venue: match.venue,
                team1: match.team1,
                team2: match.team2,
                status: match.status,
                category: match.category
            };
        });

        // Upload to Firebase
        matchesRef.set(matchesObject)
            .then(() => {
                console.log('✅ Matches data migrated successfully!');
                console.log(`   - Migrated ${iplMatches.matches.length} matches`);
            })
            .catch((error) => {
                console.error('❌ Error migrating matches data:', error);
            });
    }

    // Run migrations
    console.log('🚀 Starting migration process...\n');

    // Migrate teams first, then matches
    migrateTeamsData();

    // Wait a bit before migrating matches to avoid rate limiting
    setTimeout(() => {
        migrateMatchesData();

        setTimeout(() => {
            console.log('\n✨ Migration complete! Check Firebase Console to verify data.');
            console.log('🔗 Firebase Console: https://console.firebase.google.com/project/cricket-ipl-selector/database');
        }, 2000);
    }, 2000);
}
