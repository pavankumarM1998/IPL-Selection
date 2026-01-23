const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.cricbuzz.com/cricket-series/11253/icc-mens-t20-world-cup-2026/squads');
  
  const squads = await page.evaluate(() => {
    const data = {};
    const teams = ['India', 'Pakistan', 'Australia', 'England', 'South Africa', 'New Zealand', 'West Indies', 'Sri Lanka', 'Bangladesh', 'Afghanistan'];
    
    teams.forEach(team => {
      // Click team and extract players
      const teamElement = document.querySelector(span:contains(''));
      if (teamElement) teamElement.click();
      
      // Wait and extract
      const players = [];
      document.querySelectorAll('.cb-col-84 .cb-font-16').forEach(el => {
        players.push(el.innerText);
      });
      data[team] = players;
    });
    
    return data;
  });
  
  console.log(JSON.stringify(squads, null, 2));
  await browser.close();
})();
