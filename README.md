# Assignment 1 for CSC309H5 - Programming on the Web.

Try it out by downloading and following [setup](#setup-instructions) instructions below.

## Description

This is a NodeJS backend + HTML/JS/CSS frontend. Everything is on a single page, js controls what is shown.

The website is called "Warehouse Wars".

Technologies
  - HTML5
  - CSS
  - Javascript
  - JQuery
  - Ajax
  - NodeJS + Express
  - Restful api
  - sqlite3
  - Json web tokens

Pages
  - **Game**: The Warehouse Wars game. Game runs locally, score is sent to server on win. Naturally vulnerable to score manipulation.
  - **User Profile**: Users can add some info about themselves.
  - **Results**: User high scores.
  - **Logout**: Now that's what I call a self-documenting feature.

Other features:
  - Functionality:
    - Code is clear and concise.
    - High scores appear both on main page and on high scores page.
    - Forms use ajax properly without removing <form> tags, allowing browser to do some user-friendly things (like automatically forms.)
    - Game starts fresh once you log in.
    - User profile and high scores page both dynamically refresh on every visit.
    - Nav bar highlights current page.
  - Game:
    - Effective use of object-oriented JS for game. (Inheritance, method overriding.)
    - Game has a smart monster (chases player.)
    - Entire site on a single page, using hide/show -- no http requrests required.
    - Player can move via icons OR keyboard (q/w/e/a/d/z/x/c.)
  - Rest API:
    - Frontend and backend validation.
    - Uses GET/POST/PUT/DELETE
    - No sessions, completely restful.
    - Appropriate HTTP error codes.
    - Authenticate with each request while logged in.
  - DB:
    - Simple, clear schema and queries.
    - Prepared statements.

## Setup instructions
  - `npm install`
  - `node ww_node.js`
  - navigate to ww/ and run `setup.sh`

## Run instructions
  - navigate to ww/
  - `node ww_node.js`
  - navigate to `localhost:10600` in your browser (assuming you haven't changed config.js)
