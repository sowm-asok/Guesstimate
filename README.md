# Guesstimate game

## Summary

- Built a responsive, web-based word guessing game
  - this site uses a mix of backend-generated HTML and front-end validation JS
- REST API is used for server calls with React.js for front-end
- Implemented separation of concerns of server-side files


## Functional components in each page

### How the game works

- When the user loads the page, the site will determine if the user is logged in (based on the session cookie)
- If the user is not logged in:
  - the page will display a form which asks for a username only

- A logged in user will see:
  - A list of words the secret word could be
  - A list of any previously guessed words and how many letters each matched
  - A count of how many valid guesses they have made so far (essentially, a score a player wants to keep low)
  - What the user's most recent guess was, and how many letters it matched
    - or, if user's previous guess was invalid they will be told that guess and that it was invalid
      - This has been achieved by validation at both front-end and in the backend server side
  - If user's previous guess was correct: a message saying user has won is shown
  - If user's previous guess was incorrect: an option to make another guess
  - An option to logout
  - An option to start a new game

  - The guess is evaluated for how many letters match between the guess and secret word, regardless of position of the letters in the word and regardless of the upper/lower case of the letters.  


## Other Features

- A new game begins when a user starts a new game or logs in for the first time
- User can start a new game anytime while playing or after winning the game
- A secret word is picked at random from the list of available words
- Page reload does not affect the game status is true even if they reload the page
- The user can logout and then login as the same username and resume the game as logout does NOT clear the game information from the server


### Validations

- Server will check for a valid session id
- Username is validated both in front-end and backend server side and also checks for an allowlist of valid characters
- No information is sent to the browser that allows someone to learn the secret word without playing the game
- Note: the server will `console.log()` the username and the chosen secret word whenever a new game is started for a player (just as a check)


### Deployment

- Go to Guesstimate folder in iterm
- Run command: npm install
- Run command: node server.js
- Click on http://localhost:3000 to view the project