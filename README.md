# 🏏 IPL Squad Builder & Selector

A modern, interactive web application for building and managing IPL (Indian Premier League) cricket squads. Select your favorite team, build your dream Playing XI, managing detailed player stats, and simulate fantasy matchups.

![App Screenshot](https://cricket-ipl-selector.web.app/cricket_logo.svg) 
*(Live Demo: [https://cricket-ipl-selector.web.app](https://cricket-ipl-selector.web.app))*

## ✨ Features

*   **Team Selection:** Browse and select from all major IPL franchises (CSK, MI, RCB, etc.).
*   **Interactive Squad Builder:**
    *   Drag and drop interface (implied).
    *   **Rule Validation:** Enforces 11-player limit and maximum 4 overseas players rule.
    *   **Impact Player:** Dedicated slot for the Impact Player rule.
*   **Match Schedule:** View the full 2026 IPL fixture list with filtering (League, Playoffs, Upcoming).
*   **Fantasy Match Builder:** Create fantasy lineups for specific head-to-head matches.
*   **User Accounts:**
    *   **Google Sign-In:** Secure authentication powered by Firebase.
    *   **Cloud Save:** Save your created squads and fantasy teams to the cloud.
    *   **My Squads:** View, load, and delete your saved lineups anytime.
*   **Modern UI:** Glassmorphism design, smooth animations, and fully responsive layout.

## 🛠️ Tech Stack

*   **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (ES6+)
*   **Backend / Cloud:** Firebase (Google)
    *   **Authentication:** Google Sign-In
    *   **Realtime Database:** Storing user squads and metadata
    *   **Hosting:** Firebase Hosting
*   **Tools:** Python (for data scraping/utilities)

## 🚀 Getting Started

### Prerequisites
*   A modern web browser (Chrome, Edge, Firefox).
*   (Optional) Python for running a local server.

### Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/pavankumarM1998/IPL-Selection.git
    cd IPL-Selection
    ```

2.  **Start a local server:**
    You can use Python's built-in HTTP server:
    ```bash
    python -m http.server 8000
    ```

3.  **Open in Browser:**
    Go to `http://localhost:8000`
    *(Note: Use `localhost` instead of `127.0.0.1` for Google Sign-In to work correctly).*

## 📂 Project Structure

*   `index.html`: Main entry point and layout.
*   `styles.css`: All visual styling (Glassmorphism, Grid/Flex layouts).
*   `app.js`: Core application logic (Navigation, Initialization).
*   `squad-manager.js`: Logic for managing Team/Player selection.
*   `match-builder.js`: Logic for the Fantasy Match Builder feature.
*   `saved-squads.js`: Handles loading/saving from Firebase Realtime DB.
*   `auth.js`: Manages Google Sign-In and User Session.
*   `data.js`: Static player and team data.

## 🤝 Contributing

Feel free to fork this repository and submit pull requests!

---
*Built with ❤️ for Cricket Fans*
