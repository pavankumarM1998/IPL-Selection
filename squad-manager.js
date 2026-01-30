// Squad Manager for Cloud Firestore
// Handles saving, loading, and managing user squads

class SquadManager {
    constructor() {
        this.currentUserId = null;
        this.squads = [];

        // Listen for auth state changes
        if (typeof firebaseAuth !== 'undefined') {
            firebaseAuth.onAuthStateChanged((user) => {
                this.currentUserId = user ? user.uid : null;
                if (user) {
                    this.loadUserSquads();
                } else {
                    this.squads = [];
                }
            });
        }
    }

    // Save squad to Realtime Database
    async saveSquad(squadData) {
        if (!this.currentUserId) {
            throw new Error('User must be signed in to save squads');
        }

        // INPUT VALIDATION
        const name = (squadData.name || '').trim();
        if (!name || name.length === 0) {
            throw new Error('Squad name cannot be empty');
        }
        if (name.length > 30) {
            throw new Error('Squad name must be under 30 characters');
        }
        // Basic sanitization
        if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
            throw new Error('Squad name can only contain letters, numbers, and spaces');
        }

        if (!squadData.players || squadData.players.length !== 11) {
            throw new Error('Squad must have exactly 11 players');
        }

        // Sanitize squad name for storage
        squadData.name = name;

        try {
            // Generate a new key
            const newSquadRef = firebaseDB.ref(`users/${this.currentUserId}/savedSquads`).push();

            const squad = {
                id: newSquadRef.key,
                name: squadData.name,
                teamId: squadData.teamId,
                teamName: squadData.teamName,
                teamColor: squadData.teamColor,
                teamLogo: squadData.teamLogo,
                players: squadData.players,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                updatedAt: firebase.database.ServerValue.TIMESTAMP
            };

            await newSquadRef.set(squad);

            console.log('✅ Squad saved:', squad.name);
            return squad;
        } catch (error) {
            console.error('❌ Error saving squad:', error);
            throw error;
        }
    }

    // Load all user squads
    async loadUserSquads() {
        if (!this.currentUserId) {
            this.squads = [];
            return [];
        }

        try {
            const snapshot = await firebaseDB.ref(`users/${this.currentUserId}/savedSquads`).once('value');
            const data = snapshot.val();

            if (data) {
                // Convert Object to Array
                this.squads = Object.values(data).sort((a, b) => b.createdAt - a.createdAt);
            } else {
                this.squads = [];
            }

            console.log(`✅ Loaded ${this.squads.length} squads`);
            return this.squads;
        } catch (error) {
            console.error('❌ Error loading squads:', error);

            this.squads = [];
            return [];
        }
    }

    // Get squad by ID
    async getSquadById(squadId) {
        if (!this.currentUserId) {
            throw new Error('User must be signed in');
        }

        try {
            const snapshot = await firebaseDB.ref(`users/${this.currentUserId}/savedSquads/${squadId}`).once('value');
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                throw new Error('Squad not found');
            }
        } catch (error) {
            console.error('❌ Error getting squad:', error);
            throw error;
        }
    }

    // Delete squad
    async deleteSquad(squadId) {
        if (!this.currentUserId) {
            throw new Error('User must be signed in');
        }

        try {
            await firebaseDB.ref(`users/${this.currentUserId}/savedSquads/${squadId}`).remove();

            // Remove from local array
            this.squads = this.squads.filter(s => s.id !== squadId);

            console.log('✅ Squad deleted');
            return true;
        } catch (error) {
            console.error('❌ Error deleting squad:', error);
            throw error;
        }
    }

    // Update squad
    async updateSquad(squadId, updates) {
        if (!this.currentUserId) {
            throw new Error('User must be signed in');
        }

        try {
            updates.updatedAt = firebase.database.ServerValue.TIMESTAMP;
            await firebaseDB.ref(`users/${this.currentUserId}/savedSquads/${squadId}`).update(updates);

            console.log('✅ Squad updated');
            return true;
        } catch (error) {
            console.error('❌ Error updating squad:', error);
            throw error;
        }
    }

    // Get all squads (cached)
    getSquads() {
        return this.squads;
    }

    // Get squads count
    getSquadsCount() {
        return this.squads.length;
    }
}

// Initialize squad manager
let squadManager;
document.addEventListener('DOMContentLoaded', () => {
    squadManager = new SquadManager();
    window.squadManager = squadManager;
});
