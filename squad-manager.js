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

    // Save squad to Firestore
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
        // Basic sanitization (alphanumeric + spaces)
        if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
            throw new Error('Squad name can only contain letters, numbers, and spaces');
        }

        if (!squadData.players || squadData.players.length !== 11) {
            throw new Error('Squad must have exactly 11 players');
        }

        // Sanitize squad name for storage
        squadData.name = name;

        try {
            const squadRef = firebaseFirestore
                .collection('users')
                .doc(this.currentUserId)
                .collection('savedSquads')
                .doc();

            const squad = {
                id: squadRef.id,
                name: squadData.name,
                teamId: squadData.teamId,
                teamName: squadData.teamName,
                teamColor: squadData.teamColor,
                teamLogo: squadData.teamLogo,
                players: squadData.players,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await squadRef.set(squad);

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
            const snapshot = await firebaseFirestore
                .collection('users')
                .doc(this.currentUserId)
                .collection('savedSquads')
                .orderBy('createdAt', 'desc')
                .get();

            this.squads = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

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
            const doc = await firebaseFirestore
                .collection('users')
                .doc(this.currentUserId)
                .collection('savedSquads')
                .doc(squadId)
                .get();

            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
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
            await firebaseFirestore
                .collection('users')
                .doc(this.currentUserId)
                .collection('savedSquads')
                .doc(squadId)
                .delete();

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
            await firebaseFirestore
                .collection('users')
                .doc(this.currentUserId)
                .collection('savedSquads')
                .doc(squadId)
                .update({
                    ...updates,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });

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
