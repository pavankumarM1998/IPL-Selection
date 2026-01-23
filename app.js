// IPL Team Selection Tool - Refactored Application Logic

class TeamSelector {
    constructor() {
        this.selectedTeam = null;
        this.selectedPlayers = new Array(12).fill(null); // 11 + 1 impact player
        this.init();
    }

    init() {
        this.showHomeScreen();
        this.setupEventListeners();
    }

    // Show home screen with team selection
    showHomeScreen() {
        document.getElementById('homeScreen').classList.remove('hidden');
        document.getElementById('teamBuilderScreen').classList.add('hidden');
        document.getElementById('headerSubtitle').textContent = 'Choose Your Team';

        this.renderTeamsGrid();
    }

    // Render teams grid on home screen
    renderTeamsGrid() {
        const teamsGrid = document.getElementById('teamsGrid');
        teamsGrid.innerHTML = '';

        iplData.teams.forEach(team => {
            const teamCard = this.createHomeTeamCard(team);
            teamsGrid.appendChild(teamCard);
        });
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
        document.getElementById('homeScreen').classList.add('hidden');
        document.getElementById('teamBuilderScreen').classList.remove('hidden');
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
        const headerActions = document.getElementById('headerActions');
        headerActions.innerHTML = `
            <button class="btn-secondary" id="backBtn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back
            </button>
            <button class="btn-secondary" id="saveBtn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                </svg>
                Save
            </button>
            <button class="btn-secondary" id="exportBtn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export
            </button>
            <button class="btn-secondary" id="clearAllBtn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                </svg>
                Clear All
            </button>
        `;

        // Add event listeners
        document.getElementById('backBtn').addEventListener('click', () => this.showHomeScreen());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveSquad());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportTeam());
        document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAll());
    }

    // Render players list
    renderPlayers() {
        const playersList = document.getElementById('playersList');
        playersList.innerHTML = '';

        this.selectedTeam.players.forEach(player => {
            const playerItem = this.createPlayerItem(player);
            playersList.appendChild(playerItem);
        });
    }

    // Create a player item
    createPlayerItem(player) {
        const item = document.createElement('div');
        item.className = 'player-item';
        item.dataset.playerId = player.id;
        item.dataset.playerName = player.name;
        item.dataset.role = player.role;
        item.draggable = true;

        item.innerHTML = `
            <div class="player-details">
                <div class="player-name">${player.name}</div>
                <span class="player-role ${player.role}">${roleNames[player.role]}</span>
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

    // Render Playing XI board
    renderPlayingXI() {
        const playingXI = document.getElementById('playingXI');
        const impactPlayerSlot = document.getElementById('impactPlayerSlot');

        playingXI.innerHTML = '';
        impactPlayerSlot.innerHTML = '';

        // Render 11 main slots
        for (let i = 0; i < 11; i++) {
            const slot = this.createPlayerSlot(i);
            playingXI.appendChild(slot);
        }

        // Render 1 impact player slot
        const impactSlot = this.createPlayerSlot(11, true);
        impactPlayerSlot.appendChild(impactSlot);
    }

    // Create a player slot
    createPlayerSlot(index, isImpactPlayer = false) {
        const slot = document.createElement('div');
        slot.className = 'player-slot empty';
        slot.dataset.slotIndex = index;

        const player = this.selectedPlayers[index];

        if (player) {
            slot.classList.remove('empty');
            slot.classList.add('filled');
            slot.style.background = `linear-gradient(135deg, ${this.selectedTeam.color}dd, ${this.selectedTeam.color}88)`;
            slot.innerHTML = `
                ${!isImpactPlayer ? `<div class="slot-number">${index + 1}</div>` : ''}
                <div class="slot-player-info">
                    <div class="slot-player-name">${player.name}</div>
                    <div class="slot-player-team">${this.selectedTeam.shortName}</div>
                    <div class="slot-player-role">${roleNames[player.role]}</div>
                </div>
                <button class="remove-player" aria-label="Remove player">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;

            const removeBtn = slot.querySelector('.remove-player');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removePlayer(index);
            });
        } else {
            if (!isImpactPlayer) {
                slot.innerHTML = `
                    <div class="slot-number">${index + 1}</div>
                    <div class="slot-placeholder">Drop player here</div>
                `;
            } else {
                slot.innerHTML = `
                    <div class="slot-placeholder">Impact Player (Optional)</div>
                `;
            }
        }

        // Drop events
        slot.addEventListener('dragover', (e) => this.handleDragOver(e));
        slot.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        slot.addEventListener('drop', (e) => this.handleDrop(e));

        return slot;
    }

    // Drag and Drop Handlers
    handleDragStart(e) {
        const playerId = e.currentTarget.dataset.playerId;
        const playerName = e.currentTarget.dataset.playerName;
        const role = e.currentTarget.dataset.role;

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('playerId', playerId);
        e.dataTransfer.setData('playerName', playerName);
        e.dataTransfer.setData('role', role);

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

        // Check if player is already selected
        if (this.isPlayerSelected(playerId)) {
            this.showWarning('This player is already in your team!');
            return;
        }

        // Add player to slot
        this.addPlayer(slotIndex, {
            id: playerId,
            name: playerName,
            role: role
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

    // Save squad
    saveSquad() {
        const playingXI = this.selectedPlayers.slice(0, 11).filter(p => p !== null);
        if (playingXI.length === 0) {
            alert('Please add at least one player before saving!');
            return;
        }

        const squadName = prompt('Enter a name for this squad:', `${this.selectedTeam.shortName} Playing XI`);
        if (!squadName) return;

        const squad = {
            name: squadName,
            team: this.selectedTeam.id,
            players: this.selectedPlayers,
            savedAt: new Date().toISOString()
        };

        let savedSquads = JSON.parse(localStorage.getItem('iplSquads') || '[]');
        savedSquads.push(squad);
        localStorage.setItem('iplSquads', JSON.stringify(savedSquads));

        this.showWarning(`✅ Squad "${squadName}" saved successfully!`);
    }

    // Export team as text
    exportTeam() {
        const playingXI = this.selectedPlayers.slice(0, 11).filter(p => p !== null);
        const impactPlayer = this.selectedPlayers[11];

        if (playingXI.length === 0) {
            alert('Please add players to export!');
            return;
        }

        let exportText = `🏏 ${this.selectedTeam.name} - Playing XI\n`;
        exportText += `═══════════════════════════════\n\n`;
        exportText += `PLAYING XI:\n`;

        playingXI.forEach((player, index) => {
            exportText += `${index + 1}. ${player.name} - ${roleNames[player.role]}\n`;
        });

        if (impactPlayer) {
            exportText += `\nIMPACT PLAYER:\n`;
            exportText += `${impactPlayer.name} - ${roleNames[impactPlayer.role]}\n`;
        }

        exportText += `\n═══════════════════════════════\n`;
        exportText += `Total Players: ${playingXI.length}/11\n`;
        exportText += `Generated: ${new Date().toLocaleString()}\n`;

        // Download as text file
        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.selectedTeam.shortName}_Playing_XI.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showWarning('✅ Team exported successfully!');
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
    constructor() {
        this.currentFilter = 'all';
        this.setupMatchesEventListeners();
    }

    showMatchesScreen() {
        document.getElementById('homeScreen').classList.add('hidden');
        document.getElementById('teamBuilderScreen').classList.add('hidden');
        document.getElementById('matchesScreen').classList.remove('hidden');
        document.getElementById('headerSubtitle').textContent = 'IPL 2026 Schedule';

        // Update navigation buttons
        document.getElementById('navTeamsBtn').classList.remove('active');
        document.getElementById('navMatchesBtn').classList.add('active');

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
        let filteredMatches = iplMatches.matches;

        if (this.currentFilter !== 'all') {
            filteredMatches = iplMatches.matches.filter(match => {
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
        const team1Data = iplData.teams.find(t => t.id === match.team1.toLowerCase()) || { shortName: match.team1 };
        const team2Data = iplData.teams.find(t => t.id === match.team2.toLowerCase()) || { shortName: match.team2 };

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

        return card;
    }
}

// App Manager
class App {
    constructor() {
        this.teamSelector = new TeamSelector();
        this.matchSchedule = new MatchSchedule();
        this.setupNavigation();
    }

    setupNavigation() {
        // Teams button
        document.getElementById('navTeamsBtn').addEventListener('click', () => {
            this.teamSelector.showHomeScreen();
            document.getElementById('navTeamsBtn').classList.add('active');
            document.getElementById('navMatchesBtn').classList.remove('active');
            document.getElementById('matchesScreen').classList.add('hidden');
        });

        // Matches button
        document.getElementById('navMatchesBtn').addEventListener('click', () => {
            this.matchSchedule.showMatchesScreen();
        });

        // Set Teams as active by default
        document.getElementById('navTeamsBtn').classList.add('active');
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
