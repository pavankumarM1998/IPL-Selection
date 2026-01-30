// IPL Team Selection Tool - Refactored Application Logic

class TeamSelector {
    constructor(app) {
        this.app = app;
        this.selectedTeam = null;
        this.selectedPlayers = new Array(12).fill(null); // 11 + 1 impact player
        this.init();
    }

    reset() {
        this.selectedTeam = null;
        this.selectedPlayers = new Array(12).fill(null);
        this.showHomeScreen();
    }

    init() {
        this.showHomeScreen();
        this.setupEventListeners();
        this.setupActionListeners();
    }

    // Show home screen with team selection
    showHomeScreen() {
        const homeScreen = document.getElementById('homeScreen');
        const teamBuilderScreen = document.getElementById('teamBuilderScreen');
        const matchesScreen = document.getElementById('matchesScreen');
        const savedSquadsScreen = document.getElementById('savedSquadsScreen');

        if (homeScreen) { homeScreen.classList.remove('hidden'); homeScreen.style.display = 'block'; }
        if (teamBuilderScreen) { teamBuilderScreen.classList.add('hidden'); teamBuilderScreen.style.display = 'none'; }
        if (matchesScreen) { matchesScreen.classList.add('hidden'); matchesScreen.style.display = 'none'; }
        if (savedSquadsScreen) { savedSquadsScreen.classList.add('hidden'); savedSquadsScreen.style.display = 'none'; }

        // Ensure Match Builder is hidden
        const matchBuilderScreen = document.getElementById('matchBuilderScreen');
        if (matchBuilderScreen) { matchBuilderScreen.classList.add('hidden'); matchBuilderScreen.style.display = 'none'; }

        document.getElementById('headerSubtitle').textContent = 'Build Your Dream Team';

        // Restore Main Navigation
        const mainNav = document.getElementById('mainNav');
        const builderActions = document.getElementById('builderActions');

        if (mainNav) { mainNav.classList.remove('hidden'); mainNav.style.display = 'flex'; }
        if (builderActions) { builderActions.classList.add('hidden'); builderActions.style.display = 'none'; }

        // Update Nav Active States
        const navTeamsBtn = document.getElementById('navTeamsBtn');
        const navMatchesBtn = document.getElementById('navMatchesBtn');
        const navSquadsBtn = document.getElementById('navSquadsBtn');

        if (navTeamsBtn) navTeamsBtn.classList.add('active');
        if (navMatchesBtn) navMatchesBtn.classList.remove('active');
        if (navSquadsBtn) navSquadsBtn.classList.remove('active');

        this.renderTeamsGrid();
    }

    // Render teams grid on home screen
    // Render teams grid on home screen
    renderTeamsGrid() {
        const teamsGrid = document.getElementById('teamsGrid');
        teamsGrid.innerHTML = '';

        // DEBUG: Visible Check
        if (typeof iplData === 'undefined') {
            teamsGrid.innerHTML = '<div style="color:red; font-size:20px; text-align:center; grid-column:1/-1;">ERROR: iplData variable is undefined. data.js failed to load.</div>';
            return;
        }

        if (!this.app.data || !this.app.data.teams || this.app.data.teams.length === 0) {
            // Try to recover from iplData directly if app.data is empty
            if (iplData && iplData.teams) {
                this.app.data = iplData;
            } else {
                teamsGrid.innerHTML = '<div style="color:red; font-size:20px; text-align:center; grid-column:1/-1;">NO TEAMS DATA FOUND. <br> Please check data.js</div>';
                return;
            }
        }

        try {
            this.app.data.teams.forEach(team => {
                try {
                    const teamCard = this.createHomeTeamCard(team);
                    if (teamCard) teamsGrid.appendChild(teamCard);
                } catch (err) {
                    console.error("Error creating card for team:", team, err);
                }
            });

            if (this.app.data.teams.length === 0) {
                teamsGrid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:2rem;">No teams found.</div>';
            }
        } catch (e) {
            console.error("Critical Render Error", e);
            teamsGrid.innerHTML = `<div style="color:red">Render Error: ${e.message}</div>`;
        }
    }

    // Create team card for home screen
    createHomeTeamCard(team) {
        const card = document.createElement('div');
        card.className = 'team-card-home';
        card.dataset.teamId = team.id;

        card.innerHTML = `
            <div class="team-card-content">
                <div class="team-logo">
                    <img src="${team.logo}" alt="${team.name} Logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="logo-fallback" style="display:none;">${team.shortName}</div>
                </div>
                <div>
                    <div class="team-name">${team.name}</div>
                    <div class="team-short">${team.shortName}</div>
                    <div class="team-players-count">${team.players.length} Players</div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            this.selectTeam(team);
        });

        return card;
    }

    // Select a team and show team builder
    selectTeam(team) {
        this.selectedTeam = team;
        this.selectedPlayers = new Array(12).fill(null);
        this.showTeamBuilder();
    }

    // Show team builder screen
    showTeamBuilder() {
        // Hide all other screens
        document.getElementById('homeScreen').classList.add('hidden');
        document.getElementById('matchesScreen').classList.add('hidden');
        document.getElementById('savedSquadsScreen').classList.add('hidden');
        document.getElementById('matchBuilderScreen').classList.add('hidden'); // Safety

        // Show Team Builder
        const teamBuilderScreen = document.getElementById('teamBuilderScreen');
        teamBuilderScreen.classList.remove('hidden');
        teamBuilderScreen.style.display = 'flex'; // Force flex for layout

        if (document.getElementById('homeScreen')) document.getElementById('homeScreen').style.display = 'none';

        document.getElementById('headerSubtitle').textContent = this.selectedTeam.name;
        document.getElementById('teamNameTitle').textContent = `${this.selectedTeam.shortName} Players`;

        // Add header buttons
        this.renderHeaderButtons();

        // Render players and playing XI
        this.renderPlayers();
        this.renderPlayingXI();
        this.updateStats();
    }

    // Render header buttons for team builder screen
    renderHeaderButtons() {
        const mainNav = document.getElementById('mainNav');
        const builderActions = document.getElementById('builderActions');

        if (mainNav) {
            mainNav.classList.add('hidden');
            mainNav.style.display = 'none'; // Force hide
        }

        if (builderActions) {
            builderActions.classList.remove('hidden');
            builderActions.style.display = 'flex'; // Force show
        } else {
            console.error('Builder Actions container not found!');
        }
    }

    setupActionListeners() {
        // Clear listeners first to avoid duplicates if this is called multiple times
        // actually we will use onclick to be safe and overwrite

        const backBtn = document.getElementById('backBtn');
        const saveBtn = document.getElementById('saveBtn');
        const exportBtn = document.getElementById('exportBtn');
        const clearAllBtn = document.getElementById('clearAllBtn');

        if (backBtn) backBtn.onclick = () => this.showHomeScreen();

        if (saveBtn) {
            saveBtn.onclick = async () => {
                // Validation
                const playingXI = this.selectedPlayers.slice(0, 11).filter(p => p !== null);
                if (playingXI.length < 11) {
                    alert('⚠️ SQUAD INCOMPLETE\n\nYou must select exactly 11 players.\n\nCurrent: ' + playingXI.length + '/11');
                    return;
                }

                // Auth Check
                if (!firebase.auth().currentUser) {
                    alert('Please Sign In to save your squad.');
                    const authModal = document.getElementById('authModal');
                    if (authModal) authModal.classList.remove('hidden');
                    return;
                }

                const squadName = prompt('Enter a name for this squad:', `${this.selectedTeam.shortName} Playing XI`);
                if (!squadName) return;

                try {
                    const squadData = {
                        name: squadName,
                        teamId: this.selectedTeam.id,
                        teamName: this.selectedTeam.name,
                        teamColor: this.selectedTeam.color,
                        teamLogo: this.selectedTeam.logo,
                        players: playingXI // USE VALIDATED ARRAY (exactly 11)
                    };

                    await window.squadManager.saveSquad(squadData);

                    // Show success and redirect
                    this.showToast(`✅ Squad "${squadName}" saved!`, 'success');

                    // Switch to Saved Squads screen
                    if (window.savedSquadsScreen) {
                        window.savedSquadsScreen.show();

                        // Update Nav UI
                        const navTeamsBtn = document.getElementById('navTeamsBtn');
                        const navMatchesBtn = document.getElementById('navMatchesBtn');
                        const navSquadsBtn = document.getElementById('navSquadsBtn');

                        if (navTeamsBtn) navTeamsBtn.classList.remove('active');
                        if (navMatchesBtn) navMatchesBtn.classList.remove('active');
                        if (navSquadsBtn) navSquadsBtn.classList.add('active');
                    }
                } catch (error) {
                    console.error('Error saving squad:', error);
                    alert('❌ SAVE FAILED: ' + error.message);
                }
            };
        }

        if (exportBtn) exportBtn.onclick = () => this.exportSquad();

        if (clearAllBtn) clearAllBtn.onclick = () => this.clearAll();
    }

    // Render players list grouped by role
    renderPlayers() {
        const playersList = document.getElementById('playersList');
        playersList.innerHTML = '';
        playersList.scrollTop = 0; // Reset scroll

        if (!this.selectedTeam || !this.selectedTeam.players) return;

        // Categories
        const categories = [
            { id: 'wicketkeeper', title: 'Wicket Keepers' },
            { id: 'batsman', title: 'Batters' },
            { id: 'all-rounder', title: 'All Rounders' },
            { id: 'bowler', title: 'Bowlers' }
        ];

        categories.forEach(cat => {
            const playersInRole = this.selectedTeam.players.filter(p => p.role === cat.id);
            if (playersInRole.length > 0) {
                // Section Header
                const header = document.createElement('div');
                header.className = 'role-group-header';
                // Glassmorphism background to match theme and prevent overlapping text visibility
                header.style.cssText = `
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
                `;
                header.textContent = cat.title;
                playersList.appendChild(header);

                // Players
                playersInRole.forEach(player => {
                    const playerItem = this.createPlayerItem(player);
                    playersList.appendChild(playerItem);
                });
            }
        });
    }

    // Drag and Drop Handlers
    handleDragStart(e) {
        const playerId = e.currentTarget.dataset.playerId;
        const playerName = e.currentTarget.dataset.playerName;
        const role = e.currentTarget.dataset.role;
        const nationality = e.currentTarget.dataset.nationality || 'IND';

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('playerId', playerId);
        e.dataTransfer.setData('playerName', playerName);
        e.dataTransfer.setData('role', role);
        e.dataTransfer.setData('nationality', nationality);

        e.currentTarget.style.opacity = '0.5';
    }

    handleDragEnd(e) {
        e.currentTarget.style.opacity = '1';
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.currentTarget.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');

        const slotIndex = parseInt(e.currentTarget.dataset.slotIndex);
        const playerId = e.dataTransfer.getData('playerId');
        const playerName = e.dataTransfer.getData('playerName');
        const role = e.dataTransfer.getData('role');
        const nationality = e.dataTransfer.getData('nationality') || 'IND';

        // 1. Check if player is already selected
        if (this.isPlayerSelected(playerId)) {
            this.showWarning('⚠️ This player is already in your team!');
            return;
        }

        // 2. FOREIGN PLAYER LIMIT CHECK
        if (nationality !== 'IND') {
            const currentForeignCount = this.selectedPlayers.filter(p => p && p.nationality !== 'IND' && p.nationality !== undefined).length;
            // Check if the slot we are dropping into HAS a foreign player currently (replacing one doesn't increase count)
            const existingPlayerInSlot = this.selectedPlayers[slotIndex];
            const isReplacingForeign = existingPlayerInSlot && existingPlayerInSlot.nationality !== 'IND';

            if (currentForeignCount >= 4 && !isReplacingForeign) {
                this.showWarning('Please select only 4 foreign players!');
                return;
            }
        }

        // 3. Add player to slot
        this.addPlayer(slotIndex, {
            id: playerId,
            name: playerName,
            role: role,
            nationality: nationality
        });
    }

    // Get role icon based on player role
    getRoleIcon(role) {
        const icons = {
            'batsman': '🏏',
            'bowler': '⚾',
            'all-rounder': '🏏⚾',
            'wicketkeeper': '🧤'
        };
        return icons[role] || '🏏';
    }

    // Get nationality indicator (flight symbol for foreign players)
    getNationalityIndicator(nationality) {
        return nationality !== 'IND' ? '✈️' : '';
    }

    // Create a player item
    createPlayerItem(player) {
        const item = document.createElement('div');
        item.className = 'player-item';
        item.dataset.playerId = player.id;
        item.dataset.playerName = player.name;
        item.dataset.role = player.role;
        item.dataset.nationality = player.nationality || 'IND';
        item.draggable = true;

        const roleIcon = this.getRoleIcon(player.role);
        const nationalityIcon = this.getNationalityIndicator(player.nationality || 'IND');

        // Safety Fallback for roleNames
        const localRoleNames = (typeof roleNames !== 'undefined') ? roleNames : {
            'batsman': 'Batsman',
            'bowler': 'Bowler',
            'all-rounder': 'All-Rounder',
            'wicketkeeper': 'Wicketkeeper'
        };

        item.innerHTML = `
            <div class="player-details">
                <div class="player-name">
                    ${player.name} ${nationalityIcon} ${roleIcon}
                </div>
                <span class="player-role ${player.role}">${localRoleNames[player.role] || player.role}</span>
            </div>
            <svg class="drag-handle" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        `;

        // Drag events
        item.addEventListener('dragstart', (e) => this.handleDragStart(e));
        item.addEventListener('dragend', (e) => this.handleDragEnd(e));

        return item;
    }

    // Render Playing XI board with Structured Groups
    renderPlayingXI() {
        const playingXI = document.getElementById('playingXI');
        const impactPlayerSlot = document.getElementById('impactPlayerSlot');

        if (!playingXI) return;

        playingXI.innerHTML = '';

        // Apply Grid Layout to the Main Container (Row-wise/Grid-wise instead of potentially Stacked)
        playingXI.style.display = 'grid';
        playingXI.style.gridTemplateColumns = 'repeat(2, 1fr)'; // 2 Sections per row
        playingXI.style.gap = '20px';
        playingXI.style.alignItems = 'start';

        // Define Structure
        const sections = [
            { title: 'Top Order', count: 3, startIndex: 0, desc: 'Openers & No.3' },
            { title: 'Middle Order', count: 3, startIndex: 3, desc: 'Anchors & Spin Players' },
            { title: 'Finishers', count: 2, startIndex: 6, desc: 'Power Hitters' },
            { title: 'Bowlers', count: 3, startIndex: 8, desc: 'Wicket Takers' }
        ];

        sections.forEach(section => {
            // Container
            const sectionContainer = document.createElement('div');
            sectionContainer.className = 'xi-section-container';
            sectionContainer.style.cssText = 'margin-bottom: 20px; background: rgba(255,255,255,0.5); padding: 15px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05);';

            // Header
            const header = document.createElement('div');
            header.innerHTML = `
                <div style="font-weight: 700; color: var(--color-text-primary); font-size: 0.95rem; display: flex; align-items: center; justify-content: space-between;">
                    <span>${section.title}</span>
                    <span style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: normal;">${section.desc}</span>
                </div>
            `;
            sectionContainer.appendChild(header);

            // Grid
            const grid = document.createElement('div');
            grid.className = 'xi-section-grid';
            grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-top: 10px;';

            for (let i = 0; i < section.count; i++) {
                const globalIndex = section.startIndex + i;
                const slot = this.createPlayerSlot(globalIndex, this.selectedPlayers[globalIndex]);
                grid.appendChild(slot);
            }

            sectionContainer.appendChild(grid);
            playingXI.appendChild(sectionContainer);
        });

        // Impact Player
        if (impactPlayerSlot) {
            impactPlayerSlot.innerHTML = '';
            const slot = this.createPlayerSlot(11, this.selectedPlayers[11], true);
            impactPlayerSlot.appendChild(slot);
        }
    }

    // Create a player slot
    createPlayerSlot(index, player, isImpactPlayer = false) {
        const slot = document.createElement('div');
        slot.className = `player-slot ${player ? 'filled' : 'empty'}`;
        slot.dataset.slotIndex = index;

        // Make drop target
        slot.addEventListener('dragover', (e) => this.handleDragOver(e));
        slot.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        slot.addEventListener('drop', (e) => this.handleDrop(e));

        if (!player) {
            slot.innerHTML = `
                ${!isImpactPlayer ? `<div class="slot-number" style="background: rgba(0,0,0,0.05); color: #999;">${index + 1}</div>` : ''}
                <div class="empty-slot-content">
                    <span class="plus-icon">+</span>
                    <span class="empty-text">Select Player</span>
                </div>
            `;
        } else {
            const roleIcon = this.getRoleIcon(player.role);
            const nationalityIcon = this.getNationalityIndicator(player.nationality || 'IND');

            // Safety Fallback for roleNames
            const localRoleNames = (typeof roleNames !== 'undefined') ? roleNames : {
                'batsman': 'Batsman',
                'bowler': 'Bowler',
                'all-rounder': 'All-Rounder',
                'wicketkeeper': 'Wicketkeeper'
            };

            slot.style.background = `linear-gradient(135deg, ${this.selectedTeam.color}dd, ${this.selectedTeam.color}88)`;

            slot.innerHTML = `
                ${!isImpactPlayer ? `<div class="slot-number">${index + 1}</div>` : ''}
                <div class="slot-player-info">
                    <div class="slot-player-name">${player.name} ${nationalityIcon} ${roleIcon}</div>
                    <div class="slot-player-team">${this.selectedTeam.shortName}</div>
                    <div class="slot-player-role">${localRoleNames[player.role] || player.role}</div>
                </div>
                <button class="remove-player" aria-label="Remove player">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;

            slot.querySelector('.remove-player').addEventListener('click', (e) => {
                e.stopPropagation();
                this.removePlayer(index);
            });
        }

        return slot;
    }

    // Drag and Drop Handlers
    handleDragStart(e) {
        const playerId = e.currentTarget.dataset.playerId;
        const playerName = e.currentTarget.dataset.playerName;
        const role = e.currentTarget.dataset.role;
        const nationality = e.currentTarget.dataset.nationality || 'IND';

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('playerId', playerId);
        e.dataTransfer.setData('playerName', playerName);
        e.dataTransfer.setData('role', role);
        e.dataTransfer.setData('nationality', nationality);

        e.currentTarget.style.opacity = '0.5';
    }

    handleDragEnd(e) {
        e.currentTarget.style.opacity = '1';
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.currentTarget.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');

        const slotIndex = parseInt(e.currentTarget.dataset.slotIndex);
        const playerId = e.dataTransfer.getData('playerId');
        const playerName = e.dataTransfer.getData('playerName');
        const role = e.dataTransfer.getData('role');
        const nationality = e.dataTransfer.getData('nationality') || 'IND';

        // 1. Check if player is already selected
        if (this.isPlayerSelected(playerId)) {
            // Check if we are dropped ONTO the same slot (no-op)
            if (this.selectedPlayers[slotIndex] && this.selectedPlayers[slotIndex].id === playerId) {
                return;
            }
            this.showToast('⚠️ Player already in team', 'warning');
            return;
        }

        // 2. FOREIGN PLAYER LIMIT CHECK - STRICT
        if (nationality !== 'IND') {
            // Count EXISTING foreign players in the array loop
            let currentForeignCount = 0;
            for (let i = 0; i < 12; i++) {
                if (this.selectedPlayers[i] && this.selectedPlayers[i].nationality !== 'IND') {
                    currentForeignCount++;
                }
            }

            // Check if the slot we are dropping into HAS a foreign player currently
            // If we are replacing a foreign player with another foreign player, the count effectively doesn't change for validation purposes
            const existingPlayerInSlot = this.selectedPlayers[slotIndex];
            const isReplacingForeign = existingPlayerInSlot && existingPlayerInSlot.nationality !== 'IND';

            // If count is already 4 (or more) AND we are NOT replacing an existing foreign player, BLOCK IT.
            if (currentForeignCount >= 4 && !isReplacingForeign) {
                this.app.showToast('❌ Limit Reached: Max 4 Overseas Players allowed!', 'error');
                return;
            }
        }

        // 3. Add player to slot
        this.addPlayer(slotIndex, {
            id: playerId,
            name: playerName,
            role: role,
            nationality: nationality
        });
    }

    // Add player to a slot
    addPlayer(slotIndex, player) {
        this.selectedPlayers[slotIndex] = player;
        this.renderPlayingXI();
        this.updatePlayerAvailability();
        this.updateStats();
    }

    // Remove player from a slot
    removePlayer(slotIndex) {
        this.selectedPlayers[slotIndex] = null;
        this.renderPlayingXI();
        this.updatePlayerAvailability();
        this.updateStats();
    }

    // Check if player is already selected
    isPlayerSelected(playerId) {
        return this.selectedPlayers.some(player => player && player.id === playerId);
    }

    // Update player availability in players list
    updatePlayerAvailability() {
        const allPlayerItems = document.querySelectorAll('.player-item');
        allPlayerItems.forEach(item => {
            const playerId = item.dataset.playerId;
            if (this.isPlayerSelected(playerId)) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Update statistics and warnings
    updateStats() {
        const playingXICount = this.selectedPlayers.slice(0, 11).filter(p => p !== null).length;

        // Update player count
        document.getElementById('playerCount').textContent = `${playingXICount} / 11`;

        // Show warnings/insights
        this.updateWarnings();
    }

    // Update warnings and insights
    updateWarnings() {
        const infoSection = document.getElementById('infoSection');
        const warnings = [];

        const playingXI = this.selectedPlayers.slice(0, 11).filter(p => p !== null);

        // Check for wicketkeeper
        const hasWicketkeeper = playingXI.some(p => p && p.role === 'wicketkeeper');
        if (playingXI.length > 0 && !hasWicketkeeper) {
            warnings.push({
                type: 'warning',
                message: '⚠️ No wicketkeeper selected in Playing XI'
            });
        }

        // Role distribution
        const roleCounts = {
            batsman: 0,
            bowler: 0,
            'all-rounder': 0,
            wicketkeeper: 0
        };
        playingXI.forEach(p => {
            if (p) roleCounts[p.role]++;
        });

        if (playingXI.length >= 8 && roleCounts.bowler < 3) {
            warnings.push({
                type: 'info',
                message: `ℹ️ Only ${roleCounts.bowler} dedicated bowler(s). Consider adding more bowling options`
            });
        }

        // Render warnings
        if (warnings.length > 0) {
            infoSection.innerHTML = warnings.map(w => `
                <div class="info-card ${w.type === 'warning' ? 'warning-card' : ''}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    <p>${w.message}</p>
                </div>
            `).join('');
        } else if (playingXI.length === 0) {
            infoSection.innerHTML = `
                <div class="info-card">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    <p>Drag and drop players to build your Playing XI</p>
                </div>
            `;
        } else {
            infoSection.innerHTML = `
                <div class="info-card">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <p>✨ Team composition looks good! ${playingXI.length === 11 ? 'Playing XI is complete!' : `Add ${11 - playingXI.length} more player(s)`}</p>
                </div>
            `;
        }
    }

    // Show warning toast
    showWarning(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            font-weight: 500;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // Setup event listeners
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('playerSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchPlayers(e.target.value);
            });
        }
    }

    // Export team as Text (Notepad)
    exportSquad() {
        const playingXI = this.selectedPlayers.slice(0, 11).filter(p => p !== null);

        if (playingXI.length === 0) {
            alert('⚠️ CANNOT EXPORT\n\nPlease add at least one player to your squad before exporting.');
            return;
        }

        try {
            const roleNames = {
                'batsman': 'Batsman',
                'bowler': 'Bowler',
                'all-rounder': 'All-Rounder',
                'wicketkeeper': 'Wicketkeeper'
            };

            let exportText = `🏏 ${this.selectedTeam.name} - Playing XI\n`;
            exportText += `═══════════════════════════════\n\n`;
            exportText += `PLAYING XI:\n`;

            playingXI.forEach((player, index) => {
                exportText += `${index + 1}. ${player.name} - ${roleNames[player.role] || player.role}\n`;
            });

            // Impact Player
            const impactPlayer = this.selectedPlayers[11];
            if (impactPlayer) {
                exportText += `\nIMPACT PLAYER:\n`;
                exportText += `${impactPlayer.name} - ${roleNames[impactPlayer.role] || impactPlayer.role}\n`;
            }

            exportText += `\n═══════════════════════════════\n`;
            exportText += `Generate your own at Cricket Squad Builder\n`;

            const blob = new Blob([exportText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.selectedTeam.shortName}_XI.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            alert('✅ EXPORT SUCCESS\n\nSquad list downloaded as Text file!');

        } catch (error) {
            console.error("Export Failed:", error);
            const roleNames = {
                'batsman': 'Batsman',
                'bowler': 'Bowler',
                'all-rounder': 'All-Rounder',
                'wicketkeeper': 'Wicketkeeper'
            };

            let exportText = `🏏 ${this.selectedTeam.name} - Playing XI\n`;
            exportText += `═══════════════════════════════\n\n`;
            exportText += `PLAYING XI:\n`;

            playingXI.forEach((player, index) => {
                exportText += `${index + 1}. ${player.name} - ${roleNames[player.role] || player.role}\n`;
            });

            // Impact Player
            const impactPlayer = this.selectedPlayers[11];
            if (impactPlayer) {
                exportText += `\nIMPACT PLAYER:\n`;
                exportText += `${impactPlayer.name} - ${roleNames[impactPlayer.role] || impactPlayer.role}\n`;
            }

            exportText += `\n═══════════════════════════════\n`;
            exportText += `Generate your own at Cricket Squad Builder\n`;

            const blob = new Blob([exportText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.selectedTeam.shortName}_XI.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showToast('✅ Squad Text Exported!', 'success');
        }
    }

    // Search players
    searchPlayers(query) {
        const lowerQuery = query.toLowerCase();
        const allPlayerItems = document.querySelectorAll('.player-item');

        allPlayerItems.forEach(item => {
            const playerName = item.dataset.playerName.toLowerCase();

            if (playerName.includes(lowerQuery)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Clear all players
    clearAll() {
        this.selectedPlayers = new Array(12).fill(null);
        this.renderPlayingXI();
        this.updatePlayerAvailability();
        this.updateStats();
    }
}

// CSS for toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Match Schedule Manager
class MatchSchedule {
    constructor(app) {
        this.app = app;
        this.currentFilter = 'all';
        this.setupMatchesEventListeners();
    }

    reset() {
        this.renderMatches();
    }

    showMatchesScreen() {
        const homeScreen = document.getElementById('homeScreen');
        const teamBuilderScreen = document.getElementById('teamBuilderScreen');
        const matchesScreen = document.getElementById('matchesScreen');
        const savedSquadsScreen = document.getElementById('savedSquadsScreen');

        if (homeScreen) { homeScreen.classList.add('hidden'); homeScreen.style.display = 'none'; }
        if (teamBuilderScreen) { teamBuilderScreen.classList.add('hidden'); teamBuilderScreen.style.display = 'none'; }
        if (matchesScreen) { matchesScreen.classList.remove('hidden'); matchesScreen.style.display = 'block'; }
        if (savedSquadsScreen) { savedSquadsScreen.classList.add('hidden'); savedSquadsScreen.style.display = 'none'; }

        document.getElementById('headerSubtitle').textContent = 'IPL 2026 Schedule';

        // Update navigation buttons
        const navTeamsBtn = document.getElementById('navTeamsBtn');
        const navMatchesBtn = document.getElementById('navMatchesBtn');
        const navSquadsBtn = document.getElementById('navSquadsBtn');

        if (navTeamsBtn) navTeamsBtn.classList.remove('active');
        if (navMatchesBtn) navMatchesBtn.classList.add('active');
        if (navSquadsBtn) navSquadsBtn.classList.remove('active');

        this.renderMatches();
    }

    setupMatchesEventListeners() {
        // Filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update filter and re-render
                this.currentFilter = tab.dataset.filter;
                this.renderMatches();
            });
        });
    }

    renderMatches() {
        const matchesList = document.getElementById('matchesList');
        matchesList.innerHTML = '';

        // Filter matches
        let filteredMatches = this.app.matches.matches;

        if (this.currentFilter !== 'all') {
            filteredMatches = this.app.matches.matches.filter(match => {
                if (this.currentFilter === 'upcoming') {
                    return match.status === 'upcoming';
                }
                return match.category === this.currentFilter;
            });
        }

        // Render match cards
        filteredMatches.forEach(match => {
            const matchCard = this.createMatchCard(match);
            matchesList.appendChild(matchCard);
        });

        // Show empty state if no matches
        if (filteredMatches.length === 0) {
            matchesList.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--color-text-secondary);">
                    <p>No matches found for this filter.</p>
                </div>
            `;
        }
    }

    createMatchCard(match) {
        const card = document.createElement('div');
        card.className = `match-card ${match.category}`;

        // Format date and time
        const matchDate = new Date(match.date);
        const dateStr = matchDate.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Get team details (convert to lowercase to match team IDs)
        const team1Data = this.app.data.teams.find(t => t.id === match.team1.toLowerCase()) || { shortName: match.team1 };
        const team2Data = this.app.data.teams.find(t => t.id === match.team2.toLowerCase()) || { shortName: match.team2 };

        card.innerHTML = `
            <div class="match-number">
                Match ${match.matchNumber}
                <span class="match-category ${match.category}">${match.category}</span>
            </div>
            
            <div class="match-teams">
                <div class="match-team">
                    <div class="team-logo-small">
                        ${team1Data.logo ? `
                            <img src="${team1Data.logo}" alt="${team1Data.shortName}" 
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="logo-fallback-small" style="display:none;">${team1Data.shortName}</div>
                        ` : `<div class="logo-fallback-small">${team1Data.shortName}</div>`}
                    </div>
                    <div class="team-shortname">${team1Data.shortName}</div>
                </div>
                <div class="match-vs">VS</div>
                <div class="match-team">
                    <div class="team-logo-small">
                        ${team2Data.logo ? `
                            <img src="${team2Data.logo}" alt="${team2Data.shortName}"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="logo-fallback-small" style="display:none;">${team2Data.shortName}</div>
                        ` : `<div class="logo-fallback-small">${team2Data.shortName}</div>`}
                    </div>
                    <div class="team-shortname">${team2Data.shortName}</div>
                </div>
            </div>


            <div class="match-info">
                <div class="match-datetime">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    ${dateStr} • ${match.time} IST
                </div>
                <div class="match-venue">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    ${match.venue}
                </div>
                ${match.description ? `<div class="match-description">${match.description}</div>` : ''}
            </div>
        `;

        // Tooltip for better UX
        card.title = "Click to Create Fantasy Team";

        // Make card clickable via attribute for robustness
        card.style.cursor = 'pointer';
        card.setAttribute('onclick', `window.app.matchSchedule.handleMatchClick(${match.id})`);

        return card;
    }

    handleMatchClick(matchId) {
        console.log("Handling click for match ID:", matchId);
        // Find match in app data
        const match = this.app.matches.matches.find(m => m.id === matchId);

        if (!match) {
            console.error("Match not found:", matchId);
            this.app.showToast("Error finding match data", "error");
            return;
        }

        this.selectMatch(match);
    }

    selectMatch(match) {
        console.log("Selecting Match:", match);

        // Check for MatchTeamBuilder
        if (typeof MatchTeamBuilder === 'undefined') {
            console.error("MatchTeamBuilder class is not defined. Script might not be loaded.");
            this.app.showToast("System Error: Match Builder component not loaded", "error");
            return;
        }

        // Check if both teams have data
        const team1Data = this.app.data.teams.find(t => t.id === match.team1.toLowerCase());
        const team2Data = this.app.data.teams.find(t => t.id === match.team2.toLowerCase());

        console.log("Teams Found:", {
            t1: team1Data ? team1Data.id : 'missing',
            t2: team2Data ? team2Data.id : 'missing'
        });

        if (!team1Data || !team2Data) {
            this.app.showToast(`Team data missing for ${match.team1} or ${match.team2}`, 'error');
            return;
        }

        try {
            // Create and show match builder
            this.app.matchBuilder = new MatchTeamBuilder(this.app, match);
            this.app.matchBuilder.show();
        } catch (e) {
            console.error("Error creating MatchTeamBuilder:", e);
            this.app.showToast("Error launching Match Builder: " + e.message, "error");
        }
    }
}

// App Manager
// Global Error Handler
window.onerror = function (msg, url, line, col, error) {
    if (msg.includes('ResizeObserver') || msg.includes('Script error')) return;
    alert(`⚠️ APP ERROR\n\n${msg}\nLine: ${line}`);
    console.error("Global Error:", error);
};

class App {
    constructor() {
        this.app = this; // Self-reference for compatibility
        this.data = { teams: [] };
        this.matches = { matches: [] };

        // Direct Initialization
        this.initDirect();
    }

    initDirect() {
        // Check if iplData is available globally
        if (typeof iplData === 'undefined') {
            console.error("❌ CRITICAL: iplData is undefined in initDirect!");
        }

        // 1. Load Data from Firebase with Fallback
        this.loadData();
    }

    async loadData() {
        console.log("🔄 Fetching data...");

        // CHECK DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                // Re-run fallback check here?
            });
        }

        const teamsGrid = document.getElementById('teamsGrid');

        if (teamsGrid) teamsGrid.innerHTML = '<div class="loading-spinner"></div>';

        // TIMEOUT FALLBACK: If Firebase takes > 2 seconds, force local data
        const firebasePromise = (async () => {
            try {
                if (typeof firebaseDB === 'undefined') throw new Error("Firebase DB not init");
                const teamsSnapshot = await firebaseDB.ref('teams').once('value');
                const matchesSnapshot = await firebaseDB.ref('matches').once('value');
                return { teams: teamsSnapshot.val(), matches: matchesSnapshot.val() };
            } catch (e) {
                return null;
            }
        })();

        const fallbackPromise = new Promise(resolve => setTimeout(() => resolve(null), 2500));

        try {
            const result = await Promise.race([firebasePromise, fallbackPromise]);

            if (result && result.teams) {
                // Firebase Success
                const teamsData = result.teams;
                this.data.teams = Object.values(teamsData).map(team => {
                    if (team.players && typeof team.players === 'object' && !Array.isArray(team.players)) {
                        team.players = Object.values(team.players);
                    } else if (!team.players) {
                        team.players = [];
                    }
                    return team;
                });
                console.log(`✅ Loaded ${this.data.teams.length} teams from Firebase`);

                if (result.matches) {
                    this.matches.matches = Object.values(result.matches);
                }
            } else {
                throw new Error("Firebase Timeout or Empty");
            }
        } catch (error) {
            console.warn("⚠️ Using Local Data Fallback (Firebase slow/failed)", error);
            if (typeof iplData !== 'undefined') this.data = iplData;
            if (typeof iplMatches !== 'undefined') this.matches = iplMatches;
        }

        // 2. Start UI
        this.initializeApp();
    }

    initializeApp() {
        try {
            this.teamSelector = new TeamSelector(this);
            this.matchSchedule = new MatchSchedule(this);
            this.setupNavigation();

            // Force Show Home
            this.teamSelector.showHomeScreen();

            console.log("App Initialized Successfully");
        } catch (e) {
            console.error("App Initialization Failed:", e);
            document.body.innerHTML = `<div style="color:red; padding:20px;"><h1>App Crashed</h1><p>${e.message}</p></div>`;
        }
    }

    setupNavigation() {
        // Teams button
        const navTeamsBtn = document.getElementById('navTeamsBtn');
        if (navTeamsBtn) {
            navTeamsBtn.addEventListener('click', () => {
                if (this.teamSelector) this.teamSelector.showHomeScreen();
            });
        }

        // Matches button
        const navMatchesBtn = document.getElementById('navMatchesBtn');
        if (navMatchesBtn) {
            navMatchesBtn.addEventListener('click', () => {
                if (this.matchSchedule) this.matchSchedule.showMatchesScreen();
            });
        }

        // My Squads button
        const navSquadsBtn = document.getElementById('navSquadsBtn');
        if (navSquadsBtn) {
            navSquadsBtn.addEventListener('click', () => {
                if (window.savedSquadsScreen) {
                    window.savedSquadsScreen.show();

                    // Update active states
                    if (navTeamsBtn) navTeamsBtn.classList.remove('active');
                    if (navMatchesBtn) navMatchesBtn.classList.remove('active');
                    navSquadsBtn.classList.add('active');
                }
            });
        }

        // Set Teams as active by default
        if (navTeamsBtn) navTeamsBtn.classList.add('active');
    }

    // Toast helper
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = 'position:fixed; top:20px; right:20px; background:#333; color:white; padding:10px 20px; border-radius:5px; z-index:9999;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// Initialize the app
window.app = new App();
