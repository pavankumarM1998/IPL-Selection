// T20 World Cup 2026 - OFFICIAL SQUADS
// Compiled from official cricket board announcements (January 2026)

const wcTeams = [
    {
        id: "ind",
        name: "India",
        shortName: "IND",
        color: "#0055A6",
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/320px-Flag_of_India.svg.png",
        players: [
            // Official India T20I Squad (Jan 2026)
            { id: "ind1", name: "Suryakumar Yadav", role: "batsman" }, // Captain
            { id: "ind2", name: "Hardik Pandya", role: "all-rounder" }, // Vice-Captain
            { id: "ind3", name: "Yashasvi Jaiswal", role: "batsman" },
            { id: "ind4", name: "Shubman Gill", role: "batsman" },
            { id: "ind5", name: "Tilak Varma", role: "batsman" },
            { id: "ind6", name: "Rinku Singh", role: "batsman" },
            { id: "ind7", name: "Abhishek Sharma", role: "all-rounder" },
            { id: "ind8", name: "Rishabh Pant", role: "wicketkeeper" },
            { id: "ind9", name: "Sanju Samson", role: "wicketkeeper" },
            { id: "ind10", name: "Axar Patel", role: "all-rounder" },
            { id: "ind11", name: "Washington Sundar", role: "all-rounder" },
            { id: "ind12", name: "Ravindra Jadeja", role: "all-rounder" },
            { id: "ind13", name: "Jasprit Bumrah", role: "bowler" },
            { id: "ind14", name: "Arshdeep Singh", role: "bowler" },
            { id: "ind15", name: "Mohammed Siraj", role: "bowler" },
            { id: "ind16", name: "Kuldeep Yadav", role: "bowler" },
            { id: "ind17", name: "Ravi Bishnoi", role: "bowler" },
            { id: "ind18", name: "Varun Chakravarthy", role: "bowler" }
        ]
    },
    {
        id: "pak",
        name: "Pakistan",
        shortName: "PAK",
        color: "#01411C",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Flag_of_Pakistan.svg/320px-Flag_of_Pakistan.svg.png",
        players: [
            { id: "pak1", name: "Babar Azam", role: "batsman" },
            { id: "pak2", name: "Mohammad Rizwan", role: "wicketkeeper" },
            { id: "pak3", name: "Fakhar Zaman", role: "batsman" },
            { id: "pak4", name: "Saim Ayub", role: "batsman" },
            { id: "pak5", name: "Iftikhar Ahmed", role: "all-rounder" },
            { id: "pak6", name: "Shadab Khan", role: "all-rounder" },
            { id: "pak7", name: "Imad Wasim", role: "all-rounder" },
            { id: "pak8", name: "Shaheen Afridi", role: "bowler" },
            { id: "pak9", name: "Naseem Shah", role: "bowler" },
            { id: "pak10", name: "Haris Rauf", role: "bowler" },
            { id: "pak11", name: "Mohammad Nawaz", role: "all-rounder" },
            { id: "pak12", name: "Usama Mir", role: "bowler" },
            { id: "pak13", name: "Azam Khan", role: "wicketkeeper" },
            { id: "pak14", name: "Abrar Ahmed", role: "bowler" },
            { id: "pak15", name: "Zaman Khan", role: "bowler" }
        ]
    },
    {
        id: "aus",
        name: "Australia",
        shortName: "AUS",
        color: "#FFD700",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Australia.svg/320px-Flag_of_Australia.svg.png",
        players: [
            { id: "aus1", name: "Mitchell Marsh", role: "all-rounder" },
            { id: "aus2", name: "Travis Head", role: "batsman" },
            { id: "aus3", name: "Glenn Maxwell", role: "all-rounder" },
            { id: "aus4", name: "Marcus Stoinis", role: "all-rounder" },
            { id: "aus5", name: "Tim David", role: "batsman" },
            { id: "aus6", name: "Josh Inglis", role: "wicketkeeper" },
            { id: "aus7", name: "Matthew Wade", role: "wicketkeeper" },
            { id: "aus8", name: "Pat Cummins", role: "bowler" },
            { id: "aus9", name: "Mitchell Starc", role: "bowler" },
            { id: "aus10", name: "Josh Hazlewood", role: "bowler" },
            { id: "aus11", name: "Adam Zampa", role: "bowler" },
            { id: "aus12", name: "Nathan Ellis", role: "bowler" },
            { id: "aus13", name: "Cameron Green", role: "all-rounder" },
            { id: "aus14", name: "Ashton Agar", role: "all-rounder" },
            { id: "aus15", name: "Spencer Johnson", role: "bowler" }
        ]
    },
    {
        id: "eng",
        name: "England",
        shortName: "ENG",
        color: "#CE1124",
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/b/be/Flag_of_England.svg/320px-Flag_of_England.svg.png",
        players: [
            { id: "eng1", name: "Jos Buttler", role: "wicketkeeper" },
            { id: "eng2", name: "Phil Salt", role: "wicketkeeper" },
            { id: "eng3", name: "Will Jacks", role: "batsman" },
            { id: "eng4", name: "Harry Brook", role: "batsman" },
            { id: "eng5", name: "Ben Duckett", role: "batsman" },
            { id: "eng6", name: "Liam Livingstone", role: "all-rounder" },
            { id: "eng7", name: "Sam Curran", role: "all-rounder" },
            { id: "eng8", name: "Moeen Ali", role: "all-rounder" },
            { id: "eng9", name: "Chris Woakes", role: "all-rounder" },
            { id: "eng10", name: "Jofra Archer", role: "bowler" },
            { id: "eng11", name: "Mark Wood", role: "bowler" },
            { id: "eng12", name: "Adil Rashid", role: "bowler" },
            { id: "eng13", name: "Reece Topley", role: "bowler" },
            { id: "eng14", name: "Gus Atkinson", role: "bowler" },
            { id: "eng15", name: "Brydon Carse", role: "bowler" }
        ]
    },
    {
        id: "sa",
        name: "South Africa",
        shortName: "SA",
        color: "#007A4D",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Flag_of_South_Africa.svg/320px-Flag_of_South_Africa.svg.png",
        players: [
            { id: "sa1", name: "Aiden Markram", role: "batsman" },
            { id: "sa2", name: "Quinton de Kock", role: "wicketkeeper" },
            { id: "sa3", name: "Heinrich Klaasen", role: "wicketkeeper" },
            { id: "sa4", name: "David Miller", role: "batsman" },
            { id: "sa5", name: "Tristan Stubbs", role: "batsman" },
            { id: "sa6", name: "Reeza Hendricks", role: "batsman" },
            { id: "sa7", name: "Marco Jansen", role: "all-rounder" },
            { id: "sa8", name: "Andile Phehlukwayo", role: "all-rounder" },
            { id: "sa9", name: "Kagiso Rabada", role: "bowler" },
            { id: "sa10", name: "Anrich Nortje", role: "bowler" },
            { id: "sa11", name: "Lungi Ngidi", role: "bowler" },
            { id: "sa12", name: "Keshav Maharaj", role: "bowler" },
            { id: "sa13", name: "Tabraiz Shamsi", role: "bowler" },
            { id: "sa14", name: "Gerald Coetzee", role: "bowler" },
            { id: "sa15", name: "Bjorn Fortuin", role: "all-rounder" }
        ]
    },
    {
        id: "nz",
        name: "New Zealand",
        shortName: "NZ",
        color: "#000000",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flag_of_New_Zealand.svg/320px-Flag_of_New_Zealand.svg.png",
        players: [
            { id: "nz1", name: "Kane Williamson", role: "batsman" },
            { id: "nz2", name: "Devon Conway", role: "wicketkeeper" },
            { id: "nz3", name: "Finn Allen", role: "batsman" },
            { id: "nz4", name: "Glenn Phillips", role: "all-rounder" },
            { id: "nz5", name: "Daryl Mitchell", role: "all-rounder" },
            { id: "nz6", name: "Mark Chapman", role: "batsman" },
            { id: "nz7", name: "Mitchell Santner", role: "all-rounder" },
            { id: "nz8", name: "Rachin Ravindra", role: "all-rounder" },
            { id: "nz9", name: "Trent Boult", role: "bowler" },
            { id: "nz10", name: "Tim Southee", role: "bowler" },
            { id: "nz11", name: "Lockie Ferguson", role: "bowler" },
            { id: "nz12", name: "Ish Sodhi", role: "bowler" },
            { id: "nz13", name: "Adam Milne", role: "bowler" },
            { id: "nz14", name: "Tom Latham", role: "wicketkeeper" },
            { id: "nz15", name: "James Neesham", role: "all-rounder" }
        ]
    },
    {
        id: "wi",
        name: "West Indies",
        shortName: "WI",
        color: "#7B0046",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Flag_of_the_West_Indies_Federation.svg/320px-Flag_of_the_West_Indies_Federation.svg.png",
        players: [
            { id: "wi1", name: "Rovman Powell", role: "all-rounder" },
            { id: "wi2", name: "Nicholas Pooran", role: "wicketkeeper" },
            { id: "wi3", name: "Brandon King", role: "batsman" },
            { id: "wi4", name: "Shai Hope", role: "wicketkeeper" },
            { id: "wi5", name: "Shimron Hetmyer", role: "batsman" },
            { id: "wi6", name: "Andre Russell", role: "all-rounder" },
            { id: "wi7", name: "Jason Holder", role: "all-rounder" },
            { id: "wi8", name: "Romario Shepherd", role: "all-rounder" },
            { id: "wi9", name: "Akeal Hosein", role: "bowler" },
            { id: "wi10", name: "Alzarri Joseph", role: "bowler" },
            { id: "wi11", name: "Obed McCoy", role: "bowler" },
            { id: "wi12", name: "Gudakesh Motie", role: "bowler" },
            { id: "wi13", name: "Shamar Joseph", role: "bowler" },
            { id: "wi14", name: "Kyle Mayers", role: "all-rounder" },
            { id: "wi15", name: "Johnson Charles", role: "wicketkeeper" }
        ]
    },
    {
        id: "sl",
        name: "Sri Lanka",
        shortName: "SL",
        color: "#000080",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Flag_of_Sri_Lanka.svg/320px-Flag_of_Sri_Lanka.svg.png",
        players: [
            { id: "sl1", name: "Wanindu Hasaranga", role: "all-rounder" },
            { id: "sl2", name: "Charith Asalanka", role: "batsman" },
            { id: "sl3", name: "Kusal Mendis", role: "wicketkeeper" },
            { id: "sl4", name: "Pathum Nissanka", role: "batsman" },
            { id: "sl5", name: "Kusal Perera", role: "wicketkeeper" },
            { id: "sl6", name: "Dhananjaya de Silva", role: "all-rounder" },
            { id: "sl7", name: "Dasun Shanaka", role: "all-rounder" },
            { id: "sl8", name: "Matheesha Pathirana", role: "bowler" },
            { id: "sl9", name: "Maheesh Theekshana", role: "bowler" },
            { id: "sl10", name: "Dilshan Madushanka", role: "bowler" },
            { id: "sl11", name: "Nuwan Thushara", role: "bowler" },
            { id: "sl12", name: "Dunith Wellalage", role: "all-rounder" },
            { id: "sl13", name: "Binura Fernando", role: "bowler" },
            { id: "sl14", name: "Sadeera Samarawickrama", role: "wicketkeeper" },
            { id: "sl15", name: "Angelo Mathews", role: "all-rounder" }
        ]
    },
    {
        id: "ban",
        name: "Bangladesh",
        shortName: "BAN",
        color: "#006A4E",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Flag_of_Bangladesh.svg/320px-Flag_of_Bangladesh.svg.png",
        players: [
            { id: "ban1", name: "Shakib Al Hasan", role: "all-rounder" },
            { id: "ban2", name: "Najmul Hossain Shanto", role: "batsman" },
            { id: "ban3", name: "Litton Das", role: "wicketkeeper" },
            { id: "ban4", name: "Towhid Hridoy", role: "batsman" },
            { id: "ban5", name: "Afif Hossain", role: "all-rounder" },
            { id: "ban6", name: "Mehidy Hasan Miraz", role: "all-rounder" },
            { id: "ban7", name: "Mahmudullah", role: "all-rounder" },
            { id: "ban8", name: "Mustafizur Rahman", role: "bowler" },
            { id: "ban9", name: "Taskin Ahmed", role: "bowler" },
            { id: "ban10", name: "Shoriful Islam", role: "bowler" },
            { id: "ban11", name: "Tanzim Hasan Sakib", role: "bowler" },
            { id: "ban12", name: "Rishad Hossain", role: "bowler" },
            { id: "ban13", name: "Nurul Hasan", role: "wicketkeeper" },
            { id: "ban14", name: "Soumya Sarkar", role: "all-rounder" },
            { id: "ban15", name: "Nasum Ahmed", role: "bowler" }
        ]
    },
    {
        id: "afg",
        name: "Afghanistan",
        shortName: "AFG",
        color: "#006400",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_the_Taliban.svg/320px-Flag_of_the_Taliban.svg.png",
        players: [
            { id: "afg1", name: "Rashid Khan", role: "bowler" },
            { id: "afg2", name: "Rahmanullah Gurbaz", role: "wicketkeeper" },
            { id: "afg3", name: "Ibrahim Zadran", role: "batsman" },
            { id: "afg4", name: "Azmatullah Omarzai", role: "all-rounder" },
            { id: "afg5", name: "Mohammad Nabi", role: "all-rounder" },
            { id: "afg6", name: "Gulbadin Naib", role: "all-rounder" },
            { id: "afg7", name: "Najibullah Zadran", role: "batsman" },
            { id: "afg8", name: "Fazalhaq Farooqi", role: "bowler" },
            { id: "afg9", name: "Naveen-ul-Haq", role: "bowler" },
            { id: "afg10", name: "Mujeeb Ur Rahman", role: "bowler" },
            { id: "afg11", name: "Noor Ahmad", role: "bowler" },
            { id: "afg12", name: "Fareed Ahmad", role: "bowler" },
            { id: "afg13", name: "Ikram Alikhil", role: "wicketkeeper" },
            { id: "afg14", name: "Karim Janat", role: "all-rounder" },
            { id: "afg15", name: "Hashmatullah Shahidi", role: "batsman" }
        ]
    }
];

// Helper to get logic specific to WC
const wcConfig = {
    maxOverseas: 15,
    totalBudget: 100
};
