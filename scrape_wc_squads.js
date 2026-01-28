const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeT20WorldCupSquads() {
    console.log('Starting T20 World Cup 2026 squad extraction...\n');

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    try {
        // Navigate to squads page
        console.log('Loading Cricbuzz squads page...');
        await page.goto('https://www.cricbuzz.com/cricket-series/11253/icc-mens-t20-world-cup-2026/squads', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        console.log('✓ Page loaded\n');

        // Wait for squad data to load
        await page.waitForSelector('.cb-col-25', { timeout: 10000 });

        // Get all team names
        const teams = await page.evaluate(() => {
            const teamElements = document.querySelectorAll('.cb-col-25 span');
            return Array.from(teamElements).map(el => el.innerText.trim()).filter(t => t.length > 2);
        });

        console.log(`Found ${teams.length} teams:`, teams.join(', '), '\n');

        const allSquads = {};

        // Extract squad for each team
        for (const teamName of teams.slice(0, 10)) { // Top 10 teams
            console.log(`Extracting ${teamName} squad...`);

            // Click on team
            await page.evaluate((team) => {
                const spans = document.querySelectorAll('.cb-col-25 span');
                const teamSpan = Array.from(spans).find(s => s.innerText.trim() === team);
                if (teamSpan) teamSpan.click();
            }, teamName);

            // Wait for squad to load
            await page.waitForTimeout(1500);

            // Extract players
            const players = await page.evaluate(() => {
                const playerData = [];

                // Try multiple selectors
                const selectors = [
                    '.cb-col-84 .cb-font-16',
                    '.cb-col-84 .cb-font-14',
                    '.cb-col-84 .text-bold',
                    '.cb-col-84 a'
                ];

                for (const selector of selectors) {
                    const elements = document.querySelectorAll(selector);
                    if (elements.length > 0) {
                        elements.forEach(el => {
                            const text = el.innerText.trim();
                            if (text && text.length > 2 && !text.includes('BATTERS') && !text.includes('ALL')) {
                                playerData.push(text);
                            }
                        });
                        if (playerData.length > 0) break;
                    }
                }

                return [...new Set(playerData)]; // Remove duplicates
            });

            if (players.length > 0) {
                allSquads[teamName] = players;
                console.log(`  ✓ Found ${players.length} players`);
            } else {
                console.log(`  ✗ No players found`);
            }
        }

        // Save to JSON
        fs.writeFileSync('scraped_squads.json', JSON.stringify(allSquads, null, 2));
        console.log('\n✓ Squads saved to scraped_squads.json');

        // Generate JavaScript file
        generateJSFile(allSquads);

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await browser.close();
    }
}

function generateJSFile(squads) {
    const teamMapping = {
        'India': 'ind',
        'Pakistan': 'pak',
        'Australia': 'aus',
        'England': 'eng',
        'South Africa': 'sa',
        'New Zealand': 'nz',
        'West Indies': 'wi',
        'Sri Lanka': 'sl',
        'Bangladesh': 'ban',
        'Afghanistan': 'afg'
    };

    const colors = {
        'India': '#0055A6',
        'Pakistan': '#01411C',
        'Australia': '#FFD700',
        'England': '#CE1124',
        'South Africa': '#007A4D',
        'New Zealand': '#000000',
        'West Indies': '#7B0046',
        'Sri Lanka': '#000080',
        'Bangladesh': '#006A4E',
        'Afghanistan': '#006400'
    };

    let jsContent = '// T20 World Cup 2026 - AUTO-GENERATED SQUADS\n';
    jsContent += '// Scraped from Cricbuzz on ' + new Date().toISOString() + '\n\n';
    jsContent += 'const wcTeams = [\n';

    for (const [teamName, players] of Object.entries(squads)) {
        const teamId = teamMapping[teamName] || teamName.toLowerCase().substring(0, 3);
        const color = colors[teamName] || '#000000';

        jsContent += `    {\n`;
        jsContent += `        id: "${teamId}",\n`;
        jsContent += `        name: "${teamName}",\n`;
        jsContent += `        shortName: "${teamName.toUpperCase().substring(0, 3)}",\n`;
        jsContent += `        color: "${color}",\n`;
        jsContent += `        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/320px-Flag_of_India.svg.png",\n`;
        jsContent += `        players: [\n`;

        players.forEach((player, index) => {
            const role = guessRole(player);
            jsContent += `            { id: "${teamId}${index + 1}", name: "${player}", role: "${role}" },\n`;
        });

        jsContent += `        ]\n`;
        jsContent += `    },\n`;
    }

    jsContent += '];\n\n';
    jsContent += 'const wcConfig = { maxOverseas: 15, totalBudget: 100 };\n';

    fs.writeFileSync('wc_data_scraped.js', jsContent);
    console.log('✓ JavaScript file generated: wc_data_scraped.js\n');
}

function guessRole(playerName) {
    const name = playerName.toLowerCase();

    // Wicketkeepers
    if (name.includes('pant') || name.includes('samson') || name.includes('rizwan') ||
        name.includes('klaasen') || name.includes('buttler') || name.includes('pooran') ||
        name.includes('mendis') || name.includes('gurbaz') || name.includes('inglis')) {
        return 'wicketkeeper';
    }

    // Bowlers
    if (name.includes('bumrah') || name.includes('arshdeep') || name.includes('siraj') ||
        name.includes('kuldeep') || name.includes('bishnoi') || name.includes('afridi') ||
        name.includes('rabada') || name.includes('starc') || name.includes('boult') ||
        name.includes('rashid') || name.includes('pathirana') || name.includes('mustafiz')) {
        return 'bowler';
    }

    // All-rounders
    if (name.includes('pandya') || name.includes('jadeja') || name.includes('axar') ||
        name.includes('sundar') || name.includes('marsh') || name.includes('maxwell') ||
        name.includes('curran') || name.includes('hasaranga') || name.includes('shakib') ||
        name.includes('santner') || name.includes('holder')) {
        return 'all-rounder';
    }

    // Default to batsman
    return 'batsman';
}

// Run the scraper
scrapeT20WorldCupSquads().catch(console.error);
