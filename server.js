"use strict";
const express = require('express');
const app = express();
const PORT = 3000;
const cookieParser = require('cookie-parser');
const uuidv4 = require('uuid').v4;

const gameModel = require('./game-model');
const gameWeb = require('./game-web');

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('./public'));

const sessions = {};

// Homepage
app.get('/', (req, res) => {

  const sid = req.cookies.sid;

  if (sid && sessions[sid]) {
    gameModel.setIsInvalidUsername(false);
    gameWeb.getInvalidUsernameMessage();
    const username = sessions[sid].username;
    gameModel.setCurrentUser(username);
    res.send(gameWeb.homePage(gameModel));
    return;
  }
  if (sid && !sessions[sid]) {
    res.status(401).send(gameWeb.loginForm(401));
    return;
  }

  res.send(gameWeb.loginForm());
});

// Login
app.post('/login', (req, res) => {
  const username = req.body.username.trim();
  const allowList = new RegExp("^[A-Za-z0-9]*$");

  if (username === 'dog' || !username || !allowList.test(username)) {
    gameModel.setIsInvalidUsername(true);
    res.status(401).send(gameWeb.loginForm());
    return;
  }

  const sid = uuidv4();
  sessions[sid] = { username }; // Store user's session to lookup in future
  res.cookie('sid', sid);

  gameModel.updateLoginCountIfExistingUser(username);

  // Condition to check user log-in first time
  if (gameModel.getLoginCount(username) === 1) {
    res.redirect(307, '/new-game');
  }
  else {
    res.redirect('/');
  }
});

// Making a guess
app.post('/guess', (req, res) => {
  const sid = req.cookies.sid;

  if (!sid && !sessions[sid]) {
    res.redirect('/');
  }

  const username = sessions[sid].username;
  const guessWord = req.body.guess.toLowerCase();
  const wordList = gameModel.getWordList();
  const secretWord = gameModel.getSecretWord(username).toLowerCase();
  const lettersMatched = gameModel.compare(guessWord, secretWord);

  // Invalid guess
  if (!wordList.includes(guessWord) || gameModel.wordAlreadyGuessed(username, guessWord)) {
    gameModel.setIsInvalidGuess(username, true);
    gameModel.setInvalidGuessWord(username, guessWord);
  }
  // Valid guess
  else {
    gameModel.setIsInvalidGuess(username, false);
    gameModel.setInvalidGuessWord(username, '');
    gameModel.setWordToPreviousGuessedList(username, guessWord, lettersMatched);
    gameModel.setValidGuessCount(username, gameModel.getValidGuessCount(username) + 1);
    // Correct guess
    if (guessWord === secretWord) {
      gameModel.setUserWonStatus(username, true);
    }
  }

  res.redirect('/');
});

// Starting a new game
app.post('/new-game', (req, res) => {
  const sid = req.cookies.sid;
  const username = sessions[sid].username;
  const wordPicked = gameModel.pickWord();
  console.log("secret word : " + wordPicked);

  if (sid && sessions[sid]) {
    gameModel.setSecretWord(username, wordPicked); //state change
    gameModel.clearGameBoard(username);
    gameModel.setInvalidGuessWord(username, '');
    gameModel.setIsInvalidGuess(username, false);
  }

  res.redirect('/');
});

// Logout
app.post('/logout', (req, res) => {

  const sid = req.cookies.sid;
  gameModel.setIsInvalidUsername(false);
  gameWeb.getInvalidUsernameMessage();
  delete sessions.sid;
  res.clearCookie('sid');
  res.redirect('/');
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
