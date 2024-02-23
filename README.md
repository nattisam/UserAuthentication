# Node.js User Authentication

This project demonstrates user authentication in Node.js using Express, bcrypt for password hashing, Passport.js for authentication, and EJS templates. 

## Features
- User registration
- User login with secure password hashing
- Session management for authenticated users
- Logout functionality

## Getting Started
1. Clone this repository.
2. Install dependencies: `npm install`.
3. Run the server: `npm run devStart`.
4. Access the application at `http://localhost:3000`.

## Usage
- Navigate to `/register` to create a new account.
- Once registered, proceed to `/login` to authenticate.
- After successful login, you'll be redirected to the home page.

## Files
- `server.js`: Main entry point for the application.
- `passport-config.js`: Configuration for Passport.js authentication.
- `index.js`, `login.js`, `register.js`: Routes handling registration, login, and homepage.

Enjoy secure user authentication in your Node.js applications!
