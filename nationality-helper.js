// Helper script to add nationality to all players in data.js
// This identifies foreign players based on common naming patterns and known players

const foreignPlayers = {
    // CSK
    'Dewald Brewis': 'RSA',
    'Noor Ahmad': 'AFG',
    'Nathan Ellis': 'AUS',
    'Jamie Overton': 'ENG',
    'Akeal Hosein': 'WI',
    'Matt Henry': 'NZ',
    'Matthew Short': 'AUS',
    'Zak Foulkes': 'NZ',

    // DC
    'Tristan Stubbs': 'RSA',
    'Mitchell Starc': 'AUS',
    'Dushmantha Chameera': 'SL',
    'Pathum Nissanka': 'SL',
    'David Miller': 'RSA',
    'Ben Duckett': 'ENG',
    'Lungi Ngidi': 'RSA',
    'Kyle Jamieson': 'NZ',

    // GT
    'Rashid Khan': 'AFG',
    'Jos Buttler': 'ENG',
    'Glenn Phillips': 'NZ',
    'Kagiso Rabada': 'RSA',
    'Jason Holder': 'WI',
    'Tom Banton': 'ENG',
    'Luke Wood': 'ENG',

    // KKR
    'Sunil Narine': 'WI',
    'Andre Russell': 'WI',
    'Rovman Powell': 'WI',
    'Rachin Ravindra': 'NZ',
    'Finn Allen': 'NZ',
    'Tim Seifert': 'NZ',
    'Mustafizur Rahman': 'BAN',
    'Cameron Green': 'AUS',
    'Matheesha Pathirana': 'SL',

    // LSG
    'Nicholas Pooran': 'WI',
    'Aiden Markram': 'RSA',
    'Matthew Breetzke': 'RSA',
    'David Miller': 'RSA',
    'Shamar Joseph': 'WI',
    'Mitchell Marsh': 'AUS',
    'Gerald Coetzee': 'RSA',

    // MI
    'Trent Boult': 'NZ',
    'Will Jacks': 'ENG',
    'Ryan Rickleton': 'RSA',
    'Mitchell Santner': 'NZ',
    'Corbin Bosch': 'RSA',
    'Allah Ghafanzar': 'AFG',
    'Sherfane Rutherford': 'WI',
    'Quinton de Kock': 'RSA',

    // PBKS
    'Marcus Stoinis': 'AUS',
    'Marco Jansen': 'RSA',
    'Lockie Ferguson': 'NZ',
    'Xavier Bartlett': 'AUS',
    'Azmatullah Omarzai': 'AFG',
    'Mitch Owen': 'AUS',
    'Ben Dwarshuis': 'AUS',
    'Cooper Connolly': 'AUS',

    // RR
    'Jofra Archer': 'ENG',
    'Shimron Hetmyer': 'WI',
    'Lhuan-Dre Pretorius': 'RSA',
    'Kwena Maphaka': 'RSA',
    'Nandre Burger': 'RSA',
    'Sam Curran': 'ENG',
    'Maheesh Theekshana': 'SL',
    'Adam Zampa': 'AUS',
    'Fazalhaq Farooqi': 'AFG',
    'Wanindu Hasaranga': 'SL',

    // RCB
    'Phil Salt': 'ENG',
    'Tim David': 'AUS',
    'Romario Shepherd': 'WI',
    'Josh Hazlewood': 'AUS',
    'Jacob Bethell': 'ENG',
    'Nuwan Thushara': 'SL',
    'Jacob Duffy': 'NZ',
    'Jordan Cox': 'ENG',

    // SRH
    'Pat Cummins': 'AUS',
    'Travis Head': 'AUS',
    'Heinrich Klaasen': 'RSA',
    'Brydon Carse': 'ENG',
    'Kamindu Mendis': 'SL',
    'Liam Livingstone': 'ENG',
    'Jack Edwards': 'AUS'
};

console.log('Foreign players identified:', Object.keys(foreignPlayers).length);
console.log('All other players will be marked as IND (Indian)');
