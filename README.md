# Nitro Frontend Proficiency Test

Display posts on a tree view

Technologies used: HTML, CSS, SCSS, Javascript, React, Typescript

## Frontend

Posts are fetched from the backend server on page load. If for some reason the request fails then the posts are loaded from a JSON file from inside the `src` folder. The posts are shown in a tree view sorted by week by default. Posts can be sorted either by week, location or author.

Clicking a post element reveals additional post related information such as author, location, date and edit button.

You can edit a post's author and location by clicking on the edit icon (a small pencil icon next to the post date). The modal window which appears on clicking the edit icon contains the form to edit author and location of that particular post.

### Frontend Installation

1. Navigate to the frontend folder through command line.
2. Run `npm install` to install all the dependencies.

### Steps to run frontend

Use `npm start` to run the frontend locally in a dev environment.

### Frontend testing

Use `npm test` to run tests

## Backend

Backend is a simple express server. Posts are served with a simple api url.

API URL: `http://localhost:3100/get-posts`

### Backend Installation

1. Navigate to the backend folder through command line.
2. Run `npm install` to install all the dependencies.

### Steps to run backend

Run `node index.js` command in the command line to run the backend locally in a dev environment.