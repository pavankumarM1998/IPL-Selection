// T20 World Cup 2026 Official Schedule
// Hosted by India & Sri Lanka
// Tournament: February 7 - March 2, 2026

const wcMatches = {
    matches: [
        // GROUP STAGE - Group A
        {
            id: "wc1",
            matchNumber: 1,
            date: "2026-02-07",
            time: "19:30",
            venue: "R. Premadasa Stadium, Colombo",
            team1: "PAK",
            team2: "NED",
            status: "upcoming",
            category: "group"
        },
        {
            id: "wc2",
            matchNumber: 2,
            date: "2026-02-07",
            time: "15:00",
            venue: "Pallekele International Cricket Stadium, Kandy",
            team1: "WI",
            team2: "BAN",
            status: "upcoming",
            category: "group"
        },
        {
            id: "wc3",
            matchNumber: 3,
            date: "2026-02-08",
            time: "19:30",
            venue: "Narendra Modi Stadium, Ahmedabad",
            team1: "IND",
            team2: "USA",
            status: "upcoming",
            category: "group"
        },

        // GROUP STAGE - Group B
        {
            id: "wc4",
            matchNumber: 4,
            date: "2026-02-08",
            time: "15:00",
            venue: "MA Chidambaram Stadium, Chennai",
            team1: "AUS",
            team2: "ZIM",
            status: "upcoming",
            category: "group"
        },
        {
            id: "wc5",
            matchNumber: 5,
            date: "2026-02-09",
            time: "19:30",
            venue: "Wankhede Stadium, Mumbai",
            team1: "ENG",
            team2: "NEP",
            status: "upcoming",
            category: "group"
        },
        {
            id: "wc6",
            matchNumber: 6,
            date: "2026-02-09",
            time: "15:00",
            venue: "M. Chinnaswamy Stadium, Bengaluru",
            team1: "SA",
            team2: "OMA",
            status: "upcoming",
            category: "group"
        },

        // GROUP STAGE - Group C
        {
            id: "wc7",
            matchNumber: 7,
            date: "2026-02-10",
            time: "19:30",
            venue: "Eden Gardens, Kolkata",
            team1: "NZ",
            team2: "AFG",
            status: "upcoming",
            category: "group"
        },
        {
            id: "wc8",
            matchNumber: 8,
            date: "2026-02-10",
            time: "15:00",
            venue: "Galle International Stadium, Galle",
            team1: "SL",
            team2: "IRE",
            status: "upcoming",
            category: "group"
        },

        // GROUP STAGE - More Matches
        {
            id: "wc9",
            matchNumber: 9,
            date: "2026-02-11",
            time: "19:30",
            venue: "Arun Jaitley Stadium, Delhi",
            team1: "IND",
            team2: "PAK",
            status: "upcoming",
            category: "group"
        },
        {
            id: "wc10",
            matchNumber: 10,
            date: "2026-02-11",
            time: "15:00",
            venue: "R. Premadasa Stadium, Colombo",
            team1: "WI",
            team2: "NED",
            status: "upcoming",
            category: "group"
        },
        {
            id: "wc11",
            matchNumber: 11,
            date: "2026-02-12",
            time: "19:30",
            venue: "M. Chinnaswamy Stadium, Bengaluru",
            team1: "AUS",
            team2: "ENG",
            status: "upcoming",
            category: "group"
        },
        {
            id: "wc12",
            matchNumber: 12,
            date: "2026-02-12",
            time: "15:00",
            venue: "Rajiv Gandhi International Stadium, Hyderabad",
            team1: "SA",
            team2: "ZIM",
            status: "upcoming",
            category: "group"
        },
        {
            id: "wc13",
            matchNumber: 13,
            date: "2026-02-13",
            time: "19:30",
            venue: "Eden Gardens, Kolkata",
            team1: "NZ",
            team2: "SL",
            status: "upcoming",
            category: "group"
        },
        {
            id: "wc14",
            matchNumber: 14,
            date: "2026-02-13",
            time: "15:00",
            venue: "Pallekele International Cricket Stadium, Kandy",
            team1: "AFG",
            team2: "IRE",
            status: "upcoming",
            category: "group"
        },
        {
            id: "wc15",
            matchNumber: 15,
            date: "2026-02-14",
            time: "19:30",
            venue: "Wankhede Stadium, Mumbai",
            team1: "IND",
            team2: "BAN",
            status: "upcoming",
            category: "group"
        },
        {
            id: "wc16",
            matchNumber: 16,
            date: "2026-02-14",
            time: "15:00",
            venue: "R. Premadasa Stadium, Colombo",
            team1: "PAK",
            team2: "WI",
            status: "upcoming",
            category: "group"
        },
        {
            id: "wc17",
            matchNumber: 17,
            date: "2026-02-15",
            time: "19:30",
            venue: "MA Chidambaram Stadium, Chennai",
            team1: "ENG",
            team2: "SA",
            status: "upcoming",
            category: "group"
        },
        {
            id: "wc18",
            matchNumber: 18,
            date: "2026-02-15",
            time: "15:00",
            venue: "M. Chinnaswamy Stadium, Bengaluru",
            team1: "AUS",
            team2: "OMA",
            status: "upcoming",
            category: "group"
        },
        {
            id: "wc19",
            matchNumber: 19,
            date: "2026-02-16",
            time: "19:30",
            venue: "Galle International Stadium, Galle",
            team1: "SL",
            team2: "NZ",
            status: "upcoming",
            category: "group"
        },
        {
            id: "wc20",
            matchNumber: 20,
            date: "2026-02-16",
            time: "15:00",
            venue: "Eden Gardens, Kolkata",
            team1: "AFG",
            team2: "NEP",
            status: "upcoming",
            category: "group"
        },

        // SUPER 8 STAGE
        {
            id: "wc_s8_1",
            matchNumber: "Super 8 - Match 1",
            date: "2026-02-20",
            time: "19:30",
            venue: "Narendra Modi Stadium, Ahmedabad",
            team1: "TBD",
            team2: "TBD",
            status: "upcoming",
            category: "super8",
            description: "Group A Winner vs Group B Runner-up"
        },
        {
            id: "wc_s8_2",
            matchNumber: "Super 8 - Match 2",
            date: "2026-02-20",
            time: "15:00",
            venue: "Wankhede Stadium, Mumbai",
            team1: "TBD",
            team2: "TBD",
            status: "upcoming",
            category: "super8",
            description: "Group C Winner vs Group D Runner-up"
        },
        {
            id: "wc_s8_3",
            matchNumber: "Super 8 - Match 3",
            date: "2026-02-21",
            time: "19:30",
            venue: "M. Chinnaswamy Stadium, Bengaluru",
            team1: "TBD",
            team2: "TBD",
            status: "upcoming",
            category: "super8"
        },
        {
            id: "wc_s8_4",
            matchNumber: "Super 8 - Match 4",
            date: "2026-02-21",
            time: "15:00",
            venue: "R. Premadasa Stadium, Colombo",
            team1: "TBD",
            team2: "TBD",
            status: "upcoming",
            category: "super8"
        },
        {
            id: "wc_s8_5",
            matchNumber: "Super 8 - Match 5",
            date: "2026-02-22",
            time: "19:30",
            venue: "Eden Gardens, Kolkata",
            team1: "TBD",
            team2: "TBD",
            status: "upcoming",
            category: "super8"
        },
        {
            id: "wc_s8_6",
            matchNumber: "Super 8 - Match 6",
            date: "2026-02-22",
            time: "15:00",
            venue: "MA Chidambaram Stadium, Chennai",
            team1: "TBD",
            team2: "TBD",
            status: "upcoming",
            category: "super8"
        },

        // SEMI-FINALS
        {
            id: "wc_sf1",
            matchNumber: "Semi Final 1",
            date: "2026-02-26",
            time: "19:30",
            venue: "Wankhede Stadium, Mumbai",
            team1: "TBD",
            team2: "TBD",
            status: "upcoming",
            category: "playoff",
            description: "1st Super 8 vs 4th Super 8"
        },
        {
            id: "wc_sf2",
            matchNumber: "Semi Final 2",
            date: "2026-02-27",
            time: "19:30",
            venue: "R. Premadasa Stadium, Colombo",
            team1: "TBD",
            team2: "TBD",
            status: "upcoming",
            category: "playoff",
            description: "2nd Super 8 vs 3rd Super 8"
        },

        // FINAL
        {
            id: "wc_final",
            matchNumber: "Final",
            date: "2026-03-02",
            time: "19:30",
            venue: "Narendra Modi Stadium, Ahmedabad",
            team1: "TBD",
            team2: "TBD",
            status: "upcoming",
            category: "playoff",
            description: "Winner SF1 vs Winner SF2"
        }
    ],

    venues: {
        "Narendra Modi Stadium, Ahmedabad": { city: "Ahmedabad, India", capacity: "132,000" },
        "Wankhede Stadium, Mumbai": { city: "Mumbai, India", capacity: "33,108" },
        "MA Chidambaram Stadium, Chennai": { city: "Chennai, India", capacity: "50,000" },
        "M. Chinnaswamy Stadium, Bengaluru": { city: "Bengaluru, India", capacity: "40,000" },
        "Eden Gardens, Kolkata": { city: "Kolkata, India", capacity: "66,349" },
        "Arun Jaitley Stadium, Delhi": { city: "Delhi, India", capacity: "41,842" },
        "Rajiv Gandhi International Stadium, Hyderabad": { city: "Hyderabad, India", capacity: "55,000" },
        "R. Premadasa Stadium, Colombo": { city: "Colombo, Sri Lanka", capacity: "35,000" },
        "Pallekele International Cricket Stadium, Kandy": { city: "Kandy, Sri Lanka", capacity: "35,000" },
        "Galle International Stadium, Galle": { city: "Galle, Sri Lanka", capacity: "20,000" }
    }
};
