// Saved Squads Screen Manager
// Handles displaying and managing saved squads

class SavedSquadsScreen {
    constructor(app) {
        this.app = app;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Back button
        const backBtn = document.getElementById('backFromSquadsBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.hide());
        }
    }

    async show() {
        // Check if user is authenticated
        if (!window.authManager || !window.authManager.isAuthenticated()) {
            window.authManager.showAuthModal();
            return;
        }

        // Hide all other screens
        document.getElementById('homeScreen').classList.add('hidden');
        document.getElementById('teamBuilderScreen').classList.add('hidden');
        document.getElementById('matchesScreen').classList.add('hidden');
        document.getElementById('savedSquadsScreen').classList.remove('hidden');

        // Update header
        document.getElementById('headerSubtitle').textContent = 'My Saved Squads';

        // Load and display squads
        await this.loadSquads();
    }

    hide() {
        if (this.app && this.app.teamSelector) {
            this.app.teamSelector.showHomeScreen();
        } else {
            console.error('App or TeamSelector not initialized');
            // Fallback manual toggle if something is wrong
            document.getElementById('savedSquadsScreen').classList.add('hidden');
            document.getElementById('savedSquadsScreen').style.display = 'none';
            document.getElementById('homeScreen').classList.remove('hidden');
            document.getElementById('homeScreen').style.display = 'block';
            const mainNav = document.getElementById('mainNav');
            if (mainNav) { mainNav.classList.remove('hidden'); mainNav.style.display = 'flex'; }
        }
    }

    async loadSquads() {
        const squadsList = document.getElementById('squadsList');
        squadsList.innerHTML = '<div class="loading-spinner"></div>';

        try {
            const squads = await window.squadManager.loadUserSquads();

            if (squads.length === 0) {
                squadsList.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: var(--color-text-secondary);">
                        <p style="font-size: 1.2rem; margin-bottom: 1rem;">📋 No saved squads yet</p>
                        <p>Build a Playing XI and save it to see it here!</p>
                    </div>
                `;
                return;
            }

            squadsList.innerHTML = '';
            squads.forEach(squad => {
                const card = this.createSquadCard(squad);
                squadsList.appendChild(card);
            });
        } catch (error) {
            console.error('Error loading squads:', error);
            squadsList.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--color-error);">
                    <p>❌ Failed to load squads</p>
                </div>
            `;
        }
    }

    createSquadCard(squad) {
        const card = document.createElement('div');
        card.className = 'squad-card';

        let createdDate = 'Unknown';
        if (squad.createdAt) {
            // Handle Firestore Timestamp (has .toDate) vs RTDB Timestamp (number)
            if (typeof squad.createdAt.toDate === 'function') {
                createdDate = new Date(squad.createdAt.toDate()).toLocaleDateString();
            } else {
                createdDate = new Date(squad.createdAt).toLocaleDateString();
            }
        }

        const playersCount = squad.players ? squad.players.filter(p => p !== null).length : 0;

        card.innerHTML = `
            <div class="squad-card-header">
                <img src="${squad.teamLogo}" alt="${squad.teamName}" class="squad-team-logo" 
                     onerror="this.style.display='none'">
                <div class="squad-info">
                    <h3>${squad.name}</h3>
                    <div class="squad-team-name">${squad.teamName}</div>
                </div>
            </div>
            <div class="squad-meta">
                <span class="squad-date">📅 ${createdDate}</span>
                <span class="squad-date">👥 ${playersCount} players</span>
            </div>
            <div class="squad-actions" style="margin-top: 1rem;">
                <button class="btn-secondary btn-sm load-squad-btn" data-squad-id="${squad.id}">
                    Load Squad
                </button>
                <button class="btn-icon delete" data-squad-id="${squad.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    </svg>
                </button>
            </div>
        `;

        // Load squad button
        const loadBtn = card.querySelector('.load-squad-btn');
        loadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.loadSquad(squad);
        });

        // Delete button
        const deleteBtn = card.querySelector('.btn-icon.delete');
        deleteBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (confirm(`Delete squad "${squad.name}"?`)) {
                await this.deleteSquad(squad.id);
            }
        });

        return card;
    }

    loadSquad(squad) {
        // Find the team
        const team = this.app.data.teams.find(t => t.id === squad.teamId);
        if (!team) {
            alert('Team not found!');
            return;
        }

        // Load the team and players
        this.app.teamSelector.selectTeam(team);
        this.app.teamSelector.selectedPlayers = squad.players;
        this.app.teamSelector.renderPlayingXI();
        this.app.teamSelector.updatePlayerAvailability();
        this.app.teamSelector.updateStats();

        // Hide saved squads screen
        this.hide();
    }

    async deleteSquad(squadId) {
        try {
            await window.squadManager.deleteSquad(squadId);
            await this.loadSquads(); // Reload the list

            if (window.authManager) {
                window.authManager.showToast('Squad deleted successfully', 'success');
            }
        } catch (error) {
            console.error('Error deleting squad:', error);
            if (window.authManager) {
                window.authManager.showToast('Failed to delete squad', 'error');
            }
        }
    }
}

// Initialize when DOM is ready
let savedSquadsScreen;
document.addEventListener('DOMContentLoaded', () => {
    // Wait for app to be initialized
    setTimeout(() => {
        if (window.app) {
            savedSquadsScreen = new SavedSquadsScreen(window.app);
            window.savedSquadsScreen = savedSquadsScreen;
        }
    }, 100);
});
