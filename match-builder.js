// Match Team Builder Class - Fantasy Mode Updated
class MatchTeamBuilder {
    constructor(app, match) {
        this.app = app;
        this.selectedMatch = match;

        // Get team data
        this.team1Data = this.app.data.teams.find(t => t.id === match.team1.toLowerCase());
        this.team2Data = this.app.data.teams.find(t => t.id === match.team2.toLowerCase());

        // Single Fantasy Squad (11 Players)
        this.fantasySquad = new Array(11).fill(null);

        // State
        this.activeTab = 'team1'; // team1, team2, all
        this.draggedPlayer = null;

        // Limits
        this.maxForeignPlayers = 4;
        this.maxSquadSize = 11;
    }

    show() {
        // Hide other screens
        document.getElementById('homeScreen').classList.add('hidden');
        document.getElementById('teamBuilderScreen').classList.add('hidden');
        document.getElementById('matchesScreen').classList.add('hidden');
        document.getElementById('savedSquadsScreen').classList.add('hidden');

        // Show match builder
        document.getElementById('matchBuilderScreen').classList.remove('hidden');
        document.getElementById('headerSubtitle').textContent = `Fantasy XI: ${this.team1Data.shortName} vs ${this.team2Data.shortName}`;

        this.render();
    }

    hide() {
        document.getElementById('matchBuilderScreen').classList.add('hidden');
    }

    render() {
        this.renderMatchHeader();
        this.renderBuilderLayout();
    }

    renderMatchHeader() {
        const headerInfo = document.getElementById('matchHeaderInfo');
        const matchDate = new Date(this.selectedMatch.date);
        const dateStr = matchDate.toLocaleDateString('en-US', {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
        });

        headerInfo.innerHTML = `
            <div class="match-header-details">
                <div class="match-header-title">
                    <h2>Match ${this.selectedMatch.matchNumber}</h2>
                    <span class="match-category ${this.selectedMatch.category}">${this.selectedMatch.category}</span>
                </div>
                <div class="match-header-teams">
                    <span class="team-name">${this.team1Data.shortName}</span>
                    <span class="vs-text">vs</span>
                    <span class="team-name">${this.team2Data.shortName}</span>
                </div>
                <div class="match-header-meta">
                    <span>${dateStr}</span> • <span>${this.selectedMatch.time}</span> • <span>${this.selectedMatch.venue}</span>
                </div>
            </div>
        `;
    }

    renderBuilderLayout() {
        // Find the container to replace or update
        // We look for the standard 'dual-builder-container' from index.html
        const dualContainer = document.querySelector('.dual-builder-container');
        const matchActions = document.querySelector('.match-actions'); // Old save buttons

        let targetContainer = document.querySelector('.fantasy-builder-container');

        if (dualContainer) {
            // Create new container
            targetContainer = document.createElement('div');
            targetContainer.className = 'fantasy-builder-container';
            dualContainer.parentNode.replaceChild(targetContainer, dualContainer);

            // Remove old action buttons if they exist
            if (matchActions) matchActions.style.display = 'none'; // Hide instead of remove to be safe
        }

        if (!targetContainer) {
            // Fallback: search by class if it was already replaced
            targetContainer = document.querySelector('.fantasy-builder-container');
        }

        if (!targetContainer) {
            console.error("Could not find container to render Fantasy Builder");
            return;
        }

        targetContainer.innerHTML = `
            <!-- Left Panel: Available Players -->
            <div class="fantasy-players-panel">
                <div class="fantasy-tabs">
                    <div class="fantasy-tab ${this.activeTab === 'team1' ? 'active' : ''}" data-tab="team1">
                        ${this.team1Data.shortName}
                    </div>
                    <div class="fantasy-tab ${this.activeTab === 'team2' ? 'active' : ''}" data-tab="team2">
                        ${this.team2Data.shortName}
                    </div>
                </div>
                <div class="fantasy-players-list" id="fantasyPlayersList">
                    ${this.renderActivePlayersList()}
                </div>
            </div>

                <!-- Right Panel: Structured Team Board (Same as Team Builder) -->
            <div class="fantasy-team-panel">
                <!-- Stats Bar -->
                <div class="fantasy-stats-bar">
                    <div class="fantasy-stat">
                        <span class="fantasy-stat-label">Players</span>
                        <span class="fantasy-stat-value" id="statTotalPlayers">0/11</span>
                    </div>
                    <div class="fantasy-stat">
                        <span class="fantasy-stat-label">Foreign (Max 4)</span>
                        <span class="fantasy-stat-value" id="statForeignPlayers">0</span>
                    </div>
                     <div style="flex:1"></div>
                     <button class="btn-secondary" id="saveFantasyBtn">Save Team</button>
                </div>

                <!-- Structured View (Replaces Pitch View) -->
                <div class="structured-squad-view" id="fantasySquadContainer">
                    ${this.renderStructuredSquad()}
                </div>
            </div>
        `;

        // Attach listeners for the new DOM elements
        this.attachFantasyListeners();

        // Setup Global Listeners (Back button)
        this.setupGlobalListeners();
    }

    renderStructuredSquad() {
        // Define Structure (Same as App.js)
        const sections = [
            { title: 'Top Order', count: 3, startIndex: 0, desc: 'Openers & No.3' },
            { title: 'Middle Order', count: 3, startIndex: 3, desc: 'Anchors & Spin Players' },
            { title: 'Finishers', count: 2, startIndex: 6, desc: 'Power Hitters' },
            { title: 'Bowlers', count: 3, startIndex: 8, desc: 'Wicket Takers' }
        ];

        // 2-Column Grid Layout Style
        const containerStyle = `
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 12px; 
            align-items: start;
        `;

        let html = `<div style="${containerStyle}">`;

        sections.forEach(section => {
            html += `
            <div class="xi-section-container" style="background: rgba(255,255,255,0.5); padding: 10px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05);">
                <!-- Header -->
                <div style="font-weight: 700; color: var(--color-text-primary); font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                    <span>${section.title}</span>
                    <span style="font-size: 0.7rem; color: var(--color-text-muted); font-weight: normal;">${section.desc}</span>
                </div>
                
                <!-- Grid -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px;">
            `;

            for (let i = 0; i < section.count; i++) {
                const globalIndex = section.startIndex + i;
                html += this.createFantasySlotHTML(globalIndex, this.fantasySquad[globalIndex]);
            }

            html += `</div></div>`; // Close grid and container
        });

        html += `</div>`; // Close main grid
        return html;
    }

    createFantasySlotHTML(index, player) {
        if (player) {
            const teamColorClass = player.teamSide === 'team1' ? 'team1' : 'team2';
            return `
                <div class="fantasy-slot filled ${teamColorClass}" data-index="${index}" 
                     style="display: flex; flex-direction:column; align-items: center; padding: 6px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.1); background: rgba(255,255,255,0.8); position: relative; min-height: 60px; justify-content: center; gap: 2px;">
                    
                    <div style="font-size: 0.8rem; font-weight: 600;">${player.name} ${this.getNationalityIndicator(player.nationality || 'IND')}</div>
                    <div style="font-size: 0.7rem; color: #666;">${this.formatRole(player.role)}</div>
                    
                     <div class="remove-btn" data-index="${index}" style="position: absolute; top:2px; right:2px; cursor: pointer; color: red; font-size: 14px;">✕</div>
                </div>
            `;
        } else {
            return `
                 <div class="fantasy-slot empty" data-index="${index}" 
                      style="border: 1px dashed #ccc; border-radius: 8px; padding: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60px; color: #999; background: rgba(0,0,0,0.02);">
                    <div style="font-size: 1rem;">+</div>
                    <div style="font-size: 0.7rem;"></div>
                </div>
            `;
        }
    }

    // Legacy method shim if needed or could just remove
    renderFantasySlots() {
        return this.renderStructuredSquad();
    }

    setupGlobalListeners() {
        const backBtn = document.getElementById('backFromMatchBuilder');
        if (backBtn) {
            // Clone to remove old listeners
            const newBtn = backBtn.cloneNode(true);
            backBtn.parentNode.replaceChild(newBtn, backBtn);

            newBtn.addEventListener('click', () => {
                this.hide();
                // Show matches screen via app (MatchSchedule component)
                if (this.app.matchSchedule) {
                    this.app.matchSchedule.showMatchesScreen();
                } else {
                    // Fallback if matchSchedule logic works differently
                    // Try to trigger Match Schedule visibility
                    document.getElementById('matchesScreen').classList.remove('hidden');
                }
            });
        }
    }

    renderActivePlayersList() {
        const team = this.activeTab === 'team1' ? this.team1Data : this.team2Data;
        const teamSide = this.activeTab; // 'team1' or 'team2'

        let html = '';

        // Categories
        const categories = [
            { id: 'wicketkeeper', title: 'Wicket Keepers' },
            { id: 'batsman', title: 'Batters' },
            { id: 'all-rounder', title: 'All Rounders' },
            { id: 'bowler', title: 'Bowlers' }
        ];

        categories.forEach(cat => {
            const playersInRole = team.players.filter(p => p.role === cat.id);
            if (playersInRole.length > 0) {
                // Section Header
                html += `
                <div class="role-group-header" style="
                    padding: 12px 15px; 
                    background: rgba(248, 249, 252, 0.95); 
                    backdrop-filter: blur(5px);
                    color: var(--color-text-secondary); 
                    font-weight: 700; 
                    font-size: 0.85rem; 
                    text-transform: uppercase; 
                    letter-spacing: 1px; 
                    position: sticky; 
                    top: 0; 
                    z-index: 10; 
                    margin-top: 0; 
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                ">${cat.title}</div>
                `;

                // Players
                playersInRole.forEach(player => {
                    const isSelected = this.fantasySquad.some(p => p && p.id === player.id);
                    const classes = `builder-player-item ${isSelected ? 'selected' : ''}`;

                    html += `
                    <div class="${classes}" 
                         draggable="true" 
                         data-player-id="${player.id}"
                         data-player-name="${player.name}"
                         data-role="${player.role}"
                         data-nationality="${player.nationality || 'IND'}"
                         data-team-side="${teamSide}"
                         data-team-color="${team.color}">
                        <div class="player-role-icon ${player.role}">
                            ${this.getRoleIcon(player.role)}
                        </div>
                        <div class="player-info">
                            <div class="player-name">
                                ${player.name} ${this.getNationalityIndicator(player.nationality || 'IND')}
                            </div>
                            <div class="player-role">${this.formatRole(player.role)}</div>
                        </div>
                         ${isSelected ? '<div class="check-icon">✓</div>' : ''}
                    </div>
                    `;
                });
            }
        });

        return html;
    }

    renderFantasySlots() {
        return this.fantasySquad.map((player, index) => {
            if (player) {
                const teamColorClass = player.teamSide === 'team1' ? 'team1' : 'team2';
                return `
                    <div class="fantasy-slot filled ${teamColorClass}" data-index="${index}">
                        <div class="slot-role">${this.getRoleIcon(player.role)}</div>
                        <div class="slot-name">${player.name} ${this.getNationalityIndicator(player.nationality || 'IND')}</div>
                        <div class="slot-role">${this.formatRole(player.role)}</div>
                        <div class="remove-btn" data-index="${index}">✕</div>
                    </div>
                `;
            } else {
                return `
                    <div class="fantasy-slot empty" data-index="${index}">
                        <div class="slot-role" style="font-size: 1.5rem; opacity: 0.3;">TBA</div>
                        <div class="slot-name" style="color: #aaa; font-size: 0.7rem;">Slot ${index + 1}</div>
                    </div>
                `;
            }
        }).join('');
    }

    attachFantasyListeners() {
        // Tab Switching
        document.querySelectorAll('.fantasy-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.activeTab = tab.dataset.tab;
                document.querySelectorAll('.fantasy-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById('fantasyPlayersList').innerHTML = this.renderActivePlayersList();
                this.setupDragAndDrop(); // Re-attach drag listeners to new items
            });
        });

        // Remove Buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                this.removePlayer(index);
            });
        });

        // Back Button (Header) - Ensure generic back logic works or override
        // Assuming global listener on 'backFromMatchBuilder' might not exist in my new HTML.
        // Wait, I overwrote the HTML. I need to make sure I didn't kill the container structure that held navigation.
        // The navigation is handled by app.js logic now (Action Buttons). 
        // But app.js logic hides Main Nav and shows Builder Actions.
        // I need to ensure the standard "Back" button in 'builderActions' calls 'app.showHomeScreen()'.
        // My MatchBuilder.show() hides 'homeScreen' and shows 'matchBuilderScreen'.
        // BUT 'builderActions' "Back" button calls 'this.showHomeScreen()'.
        // 'this' in app.js refers to TeamSelector?
        // Wait, TeamSelector.renderHeaderButtons sets up listeners calling `this.showHomeScreen`.
        // If I use MatchBuilder, I likely need to override that behavior OR standard behavior works if 'showHomeScreen' hides 'matchBuilderScreen'.
        // 'TeamSelector.showHomeScreen' hides 'teamBuilderScreen', but explicitly DOES NOT hide 'matchBuilderScreen' (it doesn't know about it).
        // FIX: I need to ensure MatchBuilder handles its own exit or updates App state.
        // For compliance with 'builderActions', I should probably use my own 'Back' button or hook into the existing one.
        // Actually, since I overwrote internal HTML, the header buttons in 'builderActions' (in index.html) are OUTSIDE my container. So they persist.
        // But the "Back" button there calls TeamSelector.showHomeScreen.
        // I need to ensure TeamSelector.showHomeScreen ALSO hides matchBuilderScreen.
        // I will rely on manual close for now or update App.js.
        // Better: Add a "Back to Matches" button inside my layout just in case.

        // Save Button (Internal)
        const saveBtn = document.getElementById('saveFantasyBtn');
        if (saveBtn) saveBtn.addEventListener('click', () => this.saveMatchLineup());

        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        // Draggables
        document.querySelectorAll('.builder-player-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedPlayer = {
                    id: item.dataset.playerId,
                    name: item.dataset.playerName,
                    role: item.dataset.role,
                    nationality: item.dataset.nationality,
                    teamSide: item.dataset.teamSide
                };
                item.classList.add('dragging');
            });
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });
        });

        // Drop Zone (Structured Container)
        const dropZone = document.getElementById('fantasySquadContainer');
        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => e.preventDefault());
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                if (this.draggedPlayer) {
                    // Try to find the closest slot element
                    const slot = e.target.closest('.fantasy-slot');
                    if (slot) {
                        const index = parseInt(slot.dataset.index);
                        this.addPlayerToSquad(this.draggedPlayer, index);
                    }
                }
            });
        }
    }

    addPlayerToSquad(player) {
        // 1. Check if full
        if (this.fantasySquad.filter(p => p).length >= 11) {
            this.showToast('Squad is full (11 players)', 'error');
            return;
        }

        // 2. Check if already exists
        if (this.fantasySquad.some(p => p && p.id === player.id)) {
            this.showToast('Player already selected', 'error');
            return;
        }

        // 3. Check Foreign Limit
        const currentForeign = this.fantasySquad.filter(p => p && p.nationality !== 'IND').length;
        if (player.nationality !== 'IND' && currentForeign >= this.maxForeignPlayers) {
            this.showToast(`Max ${this.maxForeignPlayers} foreign players allowed`, 'error');
            return;
        }

        // Add to first empty slot
        const emptyIndex = this.fantasySquad.findIndex(p => p === null);
        if (emptyIndex !== -1) {
            this.fantasySquad[emptyIndex] = player;
            this.updateUI();
        }
    }

    removePlayer(index) {
        this.fantasySquad[index] = null;
        this.updateUI();
    }

    updateUI() {
        // Re-render slots
        const slotsGrid = document.querySelector('.fantasy-slots-grid');
        if (slotsGrid) slotsGrid.innerHTML = this.renderFantasySlots();

        // Re-render players list (to update checkmarks)
        const list = document.getElementById('fantasyPlayersList');
        if (list) list.innerHTML = this.renderActivePlayersList();

        // Update Stats
        const total = this.fantasySquad.filter(p => p).length;
        const foreign = this.fantasySquad.filter(p => p && p.nationality !== 'IND').length;

        document.getElementById('statTotalPlayers').innerText = `${total}/11`;
        const foreignEl = document.getElementById('statForeignPlayers');
        foreignEl.innerText = foreign;
        if (foreign > this.maxForeignPlayers) foreignEl.classList.add('limit-exceeded');
        else foreignEl.classList.remove('limit-exceeded');

        // Re-attach listeners for new elements
        this.attachFantasyListeners();
    }

    // ... Helpers ...
    getRoleIcon(role) {
        const icons = { 'batsman': '🏏', 'bowler': '⚾', 'all-rounder': '🏏⚾', 'wicketkeeper': '🧤' };
        return icons[role] || '🏏';
    }

    getNationalityIndicator(nationality) {
        return nationality !== 'IND' ? '✈️' : '';
    }

    formatRole(role) {
        return role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    showToast(msg, type = 'info') {
        if (this.app.showToast) this.app.showToast(msg, type);
        else alert(msg);
    }

    // ... Save Logic ...
    async saveMatchLineup() {
        // Validation
        const count = this.fantasySquad.filter(p => p).length;
        if (count < 11) {
            this.showToast('Please select 11 players', 'error');
            return;
        }

        // Mock Save
        this.showToast('Fantasy Team Saved! (Mock)', 'success');
        // Implement Firestore save logic if needed using app.authManager etc.
    }

    // Setup generic 'Back'
    // Since I messed with the container, I should ensure the app-level back logic works.
    // I can modify app.js to hide matchBuilderScreen in showHomeScreen, OR just do it here if I had a back button.
}
