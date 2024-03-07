# TinyApp

## Overview

This URL shortening app is a simple web application built using Node.js and Express.js. It allows users to shorten long URLs into more manageable links. The app also provides user authentication features to secure user data and manage access to shortened URLs.

## Features

- **User Registration and Authentication**: Users can register for an account and log in securely using their email and password. Passwords are hashed using bcrypt for security.
  
- **URL Shortening**: Logged-in users can shorten long URLs by providing them through the application. Each shortened URL is associated with the user who created it.

- **URL Management**: Users can view a list of their shortened URLs, edit the destination URLs, and delete URLs they no longer need.

- **Redirection**: Shortened URLs created by users can be used to redirect to the original long URLs when accessed.

## Dependencies

- Express.js: Web application framework for Node.js.
- cookie-session: Middleware for handling session data stored in cookies.
- bcryptjs: Library for hashing passwords securely.
- EJS: Templating engine for rendering dynamic content in views.

## Installation

1. Clone the repository: `git clone https://github.com/rosario-je/tinyapp-.git url-shortening-app`
2. Navigate to the project directory: `cd url-shortening-app`
3. Install dependencies: `npm install`
4. Start the server: `npm start`
5. Access the application in your web browser at `http://localhost:8080`

## Usage

1. Register for an account by providing a valid email and password.
2. Log in with your registered credentials.
3. Shorten a long URL by entering it into the appropriate field.
4. Manage your shortened URLs by editing, deleting, or viewing them on your dashboard.
5. Share your shortened URLs with others, and they will be redirected to the original long URLs when accessed.

## File Structure

- `express_server.js`: Main entry point of the application containing server setup and routes.
- `helpers.js`: Utility functions used throughout the application.
- `database.js`: In-memory database storing user and URL data.
- `views/`: Directory containing EJS templates for rendering HTML views.
- `tests/`: Directory for test files using Mocha and Chai.

## Final Product
- Screenshot of login page
!["Screenshot of login page"](https://github.com/rosario-je/tinyapp-/blob/main/docs/login-page.jpg)
- Screenshot of register page
!["Screenshot of register page"](https://github.com/rosario-je/tinyapp-/blob/main/docs/register-page.jpg)
- Screenshot of URLs page
!["Screenshot of URLs page"](https://github.com/rosario-je/tinyapp-/blob/main/docs/urls-page.jpg)
- Screenshot of URL edit page
!["Screenshot of URL edit page"](https://github.com/rosario-je/tinyapp-/blob/main/docs/url-edit-page.jpg)
- Screenshot of URL edit user authentication page
!["Screenshot of URL edit user authentication page"](https://github.com/rosario-je/tinyapp-/blob/main/docs/url-auth-edit-page.jpg)
