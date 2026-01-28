// Firebase Configuration for Cricket IPL Team Selector
// Auto-generated configuration - DO NOT EDIT MANUALLY

const firebaseConfig = {
    apiKey: "AIzaSyBo2LsXaI4wRfZNF_LILKQus3k9wqPeDbU",
    authDomain: "cricket-ipl-selector.firebaseapp.com",
    databaseURL: "https://cricket-ipl-selector-default-rtdb.firebaseio.com",
    projectId: "cricket-ipl-selector",
    storageBucket: "cricket-ipl-selector.firebasestorage.app",
    messagingSenderId: "101712063125",
    appId: "1:101712063125:web:7d89d86f14ad0f9185499c"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

// Initialize Firebase Authentication
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Initialize Cloud Firestore
const firestore = firebase.firestore();

// Export for use in other files
window.firebaseDB = database;
window.firebaseAuth = auth;
window.googleProvider = googleProvider;
window.firebaseFirestore = firestore;
