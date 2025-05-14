# Dragon Focus

## Description

Dragon Focus is a MERN stack (MongoDB, Express.js, React.js, Node.js) application designed to help users enhance their productivity and cultivate deep focus through the Pomodoro Technique.

Currently, in its initial phase, Dragon Focus functions as a robust and clean Pomodoro timer, allowing users to track their work and break sessions effectively and view basic statistics.

The ultimate vision for Dragon Focus is to evolve into an engaging, gamified experience where users train their concentration to become "Dragon Warriors" of focus. Future versions will incorporate:

- An interactive dragon-themed environment.
- A unique UI where the app is contained within an "unfurling scroll."
- Unlockable 2D sprite characters (like ninjas or dragons) that act as "Focus Guardians."
- In-app currency earned through completed sessions to unlock content.
- A progression system, potentially with a 2D map to explore different "focus quests" or projects.
- Valuable tips and wisdom on learning and focus, inspired by works like "Limitless" by Jim Kwik and "Learning How to Learn" by Dr. Barbara Oakley.

This project aims to blend effective productivity techniques with engaging game-like elements to make the journey of improving focus enjoyable and rewarding.

## Badges

_(Coming Soon! As the project matures, badges for build status, code coverage, etc., will be added here. You can use services like [Shields.io](https://shields.io/) for this.)_

Example:
`[![Build Status](https://img.shields.io/travis/your_username/dragon-focus.svg?style=flat-square)](https://travis-ci.org/your_username/dragon-focus)`

## Visuals

Currently, the MVP provides a clean and functional interface for Pomodoro timing.

**Future Vision Preview:**
_(This section will be updated with GIFs or screenshots showcasing the envisioned 2D gamified interface, including sprite animations, the scroll UI, and the dragon-themed environment as development progresses. The goal is to give users a sneak peek of what Dragon Focus will become!)_

## Installation

Dragon Focus is a MERN stack application. You'll need Node.js and MongoDB installed on your system.

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your_username/dragon-focus.git](https://github.com/your_username/dragon-focus.git)
    cd dragon-focus
    ```

2.  **Backend Setup (Server):**

    ```bash
    cd server
    npm install
    ```

    Create a `.env` file in the `server` directory with the following variables (see `server/.env.example` if available):

    ```env
    MONGO_URI=your_mongodb_connection_string
    PORT=5000 # Or your preferred backend port
    JWT_SECRET=your_jwt_secret_key # For user authentication if implemented
    ```

    Start the backend server:

    ```bash
    npm start
    ```

3.  **Frontend Setup (Client):**
    Navigate to the client directory from the project root:
    ```bash
    cd ../client # If you were in the server directory
    # or cd client from the root
    npm install
    ```
    If your client needs to know the backend API URL, you might create a `.env` file in the `client` directory (see `client/.env.example` if available):
    ```env
    REACT_APP_API_URL=http://localhost:5000/api # Adjust if your backend runs elsewhere or has a different prefix
    ```
    Start the frontend React development server:
    ```bash
    npm start
    ```
    The application should now be running, typically at `http://localhost:3000`.

## Requirements

- Node.js (LTS version recommended)
- npm (usually comes with Node.js)
- MongoDB (local instance or a cloud service like MongoDB Atlas)

## Usage

1.  After installation, navigate to the application in your web browser (usually `http://localhost:3000`).
2.  Use the main interface to start a Pomodoro (focus) session.
3.  The timer will guide you through focus periods and break periods.
4.  Completed sessions will be recorded.
5.  Navigate to the statistics page (if implemented in the current version) to view your focus history.

_(More detailed usage instructions and feature explanations will be added as the application develops.)_

## Support

If you encounter any issues or have questions, please feel free to:

- Open an issue on the [GitHub Issues page](https://github.com/your_username/dragon-focus/issues).
- (Optional: Add other support channels like a Discord server or email if you set them up).

## Roadmap

Dragon Focus is an actively developing project with an exciting future! Here's a general outline of our plans:

- **Phase 1: Core MVP (Partially Complete / In Progress)**

  - [x] Functional Pomodoro Timer
  - [x] Basic Session Recording (Mongoose models and routes established)
  - [ ] User Statistics Display
  - [x] MERN Stack Foundation
  - [ ] User Authentication

- **Phase 2: Initial Gamification & UI Enhancements (Upcoming)**

  - Introduction of the "Scroll" UI as the main app container.
  - Static or subtly animated dragon-themed background.
  - Basic in-app currency system (e.g., "Focus Gems") earned by completing sessions.
  - First set of unlockable 2D "Focus Guardian" sprites.
  - Integration of initial focus tips and wisdom snippets.

- **Phase 3: Rich "Dragon Warrior" Experience (Future Vision)**

  - Fully interactive and animated 2D backgrounds.
  - Advanced sprite animations and interactions for Focus Guardians.
  - A 2D map interface for "Focus Quests" linked to user projects or learning goals.
  - Expanded storyline and a clear progression system for becoming a "Dragon Warrior."
  - More diverse unlockable characters, items, and UI customization options.
  - Deeper integration of learning techniques and interactive focus challenges.

- **Ongoing:**
  - Performance optimization.
  - Accessibility improvements (WCAG compliance).
  - Regularly incorporating user feedback.

## Contributing

Contributions are welcome! If you're interested in helping Dragon Focus grow, please consider the following:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `bugfix/issue-number`.
3.  **Make your changes.** Ensure your code follows the existing style and includes comments where necessary.
4.  **Test your changes thoroughly.** (Details on running tests will be added here).
5.  **Commit your changes:** `git commit -m "feat: Add some amazing feature"` or `fix: Resolve an issue`.
6.  **Push to your branch:** `git push origin feature/your-feature-name`.
7.  **Open a Pull Request** against the `main` (or `develop`) branch of the original repository.

Please open an issue first to discuss any significant changes or new features you'd like to implement.

_(Commands for linting or running tests will be added here once set up.)_

## Authors and Acknowledgment

- **Main Developer:** [Your Name/GitHub Username]
- **Inspirations:** The gamified vision is inspired by apps like Forest and Habitica. The focus and learning principles are inspired by authors like Jim Kwik ("Limitless") and Dr. Barbara Oakley ("Learning How to Learn").
- **README Template:** Thank you to [makeareadme.com](https://www.makeareadme.com/) for the initial template.

## License

_(Choose a license for your project, e.g., MIT, Apache 2.0, GPLv3. State it clearly here. For example:)_
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details (you'll need to create this file).

## Project Status

This project is currently in **active development**. The core MVP functionality is being built out, with a clear roadmap towards a unique, gamified productivity experience. We are excited about the journey ahead and welcome feedback and interest!
