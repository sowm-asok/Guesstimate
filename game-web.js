const gameModel = require("./game-model");
const words = require("./words");

const gameWeb = {

  getGuessForm: function (gameModel) {
    let username = gameModel.getCurrentUser();
    let userWonStatus = gameModel.getUserWonStatus(username);
    const disabled = userWonStatus ? "disabled" : "";
    return `
      ${gameWeb.getUserWonMessage(userWonStatus)}
      ${gameWeb.getInvalidGuessMessage(gameModel)}
      <form class="guess-form" action="/guess" method="POST">
        <label class="guess-label">Enter your guess: </label>
        <input id="guess-input-word" class="guess" name="guess" type="text" data-words="${words}" ${disabled} />
        <button class="guess-button ${disabled}" type="submit" name="guess-button" ${disabled}>Check if your guess matches!</button>
      </form>
    `;
  },

  getUserWonMessage: function (userWonStatus) {
    if (userWonStatus) {
      return `
        <p class="won-message">Congratulations, you have won the game! Start a new game to continue playing.</p>
      `;
    }
    return '';
  },

  getInvalidGuessMessage: function (gameModel) {
    let username = gameModel.getCurrentUser();
    const invalidGuessWord = gameModel.getInvalidGuessWord(username);
    if (gameModel.getIsInvalidGuess(username)) {
      return `
        <p class="invalid-guess-message">You have entered an invalid guess: <b>${invalidGuessWord}</b>. It is not in the word list or this word has already been guessed.</p>
      `;
    }
    return '';
  },

  homePage: function (gameModel) {
    return `
    <!doctype html>
      <html>
        <head>
          <title>Game</title>
          <link rel="stylesheet" href="/homepage.css" />
        </head>
        <body>
          <div id="game-app">
            <section class="header-details">
              <h2>Guesstimate</h2>
              <h3>Howdy and welcome to Guesstimate!</h3>
            </section>

            <section class="current-user">
              ${gameWeb.getLoggedInUser()}
            </section>
            <section class="logout-section">
              <form class="logout-form" action="/logout" method="POST">
                <button class="logout" type="submit" name="logout">Logout</button>
              </form>
            </section>

            <section class="user-game-data">
              <p><b>Game Board</b></p>
              ${gameWeb.getUserGameData(gameModel)}
            </section>
            <section class="game-forms">
              ${gameWeb.getGuessForm(gameModel)}
              <form class='new-game' action='/new-game' method="POST">
                <button class="new-game-button" type="submit" name="new-game-button">Start a new game!</button>
              </form>
            </section>
            <section class="word-list">
              <p><b>Guessword List</b></p>
              ${gameWeb.getWordList(gameModel)}
            </section>
          </div>
          <script src="./home.js"></script>
        </body>
      </html>
`;
  },

  getUserGameData: function (gameModel) {
    let lastGuess;
    let username = gameModel.getCurrentUser();
    let listOfGuesses = gameModel.getPreviousGuessedList(username);
    if (listOfGuesses.length === 0) {
      lastGuess = { guessWord: 'No guesses yet!', lettersMatched: 0 };
    }
    else {
      lastGuess = listOfGuesses[listOfGuesses.length - 1];
    }

    return `
    <ul class="game-data" >
        <li><b>No. of valid guesses: </b>${gameModel.getValidGuessCount(username)}</li>
        <li><b>Last guessed word: </b>${lastGuess.guessWord}</li>
        <li><b>Letters matched in last guess: </b>${lastGuess.lettersMatched}</li> </ul > ` +
      `<ol class="guess-list"><b>Valid past guesses: </b>` +
      Object.values(listOfGuesses).map(guess => `
        <li><b>Guess word: </b>${guess.guessWord}<br>
            <b>Letters matched: </b>${guess.lettersMatched}
        </li >
  `).join('') +
      `</ol> `;
  },

  getLoggedInUser: function () {
    return `
    <p>You are logged in as <b> ${gameModel.getCurrentUser()}</b></p>
    `;
  },

  getWordList: function (gameModel) {
    return `<ul class="words"> ` +
      gameModel.wordList.map(word => `<li> ${word}</li>`).join('') +
      `</ul> `;
  },

  loginForm: function (statusCode = 200) {
    const isAuthErrorClass = statusCode === 401 ? "auth-error" : "not-auth-error";

    return `
    <!doctype html >
    <html>
      <head>
        <title>Game</title>
        <link rel="stylesheet" href="/login.css" />
      </head>
      <body>
        <div id="game-app">
        <h2>Guesstimate</h2>
        <h3>Howdy and welcome to Guesstimate!</h3>
        <p class="${isAuthErrorClass}">Gotcha!! There was some issue with the cookie, please login again.</p>
        ${gameWeb.getInvalidUsernameMessage()}
        <form class ="login-form" action="/login" method="POST">
        <label class ="username-label">Username: <input class ="username" name="username" type ="text"></label>
        <button class ="login" type ="submit" name="login">Login</button>
        </form>
        <script src="./login.js"></script>
      </body>
    </html>
`;
  },

  getInvalidUsernameMessage: function () {
    let isInvalidUsernameVisible = gameModel.getIsInvalidUsername() ? 'isInvalidUsernameVisible' : 'isInvalidUsernameNotVisible';
    return `
    <p class="invalid-username-message ${isInvalidUsernameVisible}">This username is not found. Please enter a valid username.</p >
    `;
  },

};

module.exports = gameWeb;