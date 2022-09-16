const wordList = require('./words.js');

const users = [];
let currentUser = '';
let isInvalidUsername = false;
const userGameData = [];

function addNewUser(username) {
  users.push(username);
  setUserGameData({ username: username, loginCount: 1 });
}

function updateLoginCountIfExistingUser(username) {
  if (users.includes(username)) {
    setLoginCount(username, getLoginCount(username) + 1);
  }
  else {
    addNewUser(username);
  }
}

function getCurrentUser() {
  return currentUser;
}

function setCurrentUser(username) {
  currentUser = username;
}

function getIsInvalidUsername() {
  return isInvalidUsername;
}

function setIsInvalidUsername(isInvalid) {
  isInvalidUsername = isInvalid;
}

function getUserGameData(username) {
  const userObject = userGameData.find(userData => userData.name === username);
  return userObject;
}

function setUserGameData({ username, loginCount }) {
  const newUser = {
    name: username,
    loginCount: loginCount,
    previousGuesses: [],
    validGuessCount: 0,
    won: false,
    isInvalidGuess: false,
    invalidGuessWord: "",
  };
  userGameData.push(newUser);
}

function wordAlreadyGuessed(username, guessWord) {
  const userObject = getUserGameData(username);
  for (let guess of userObject.previousGuesses) {
    if (guess.guessWord === guessWord) {
      return true;
    }
  }
  return false;
}

function clearGameBoard(username) {
  const userObject = getUserGameData(username);
  userObject.previousGuesses = [];
  userObject.validGuessCount = 0;
  userObject.won = false;
}

function getLoginCount(username) {
  const userObject = getUserGameData(username);
  return userObject.loginCount;
}

function setLoginCount(username, loginCount) {
  const userObject = getUserGameData(username);
  userObject.loginCount = loginCount;
}

function getPreviousGuessedList(username) {
  const userObject = getUserGameData(username);
  return userObject.previousGuesses;
}

function setWordToPreviousGuessedList(username, guessWord, lettersMatched) {
  const userObject = getUserGameData(username);
  const guessList = userObject.previousGuesses;
  guessList.push({ guessWord: guessWord, lettersMatched: lettersMatched });
}

function getValidGuessCount(username) {
  const userObject = getUserGameData(username);
  return userObject.validGuessCount;
}

function setValidGuessCount(username, validGuessCount) {
  const userObject = getUserGameData(username);
  userObject.validGuessCount = validGuessCount;
}

function getUserWonStatus(username) {
  const userObject = getUserGameData(username);
  return userObject.won;
}

function setUserWonStatus(username, wonStatus) {
  const userObject = getUserGameData(username);
  userObject.won = wonStatus;
}

function getIsInvalidGuess(username) {
  const userObject = getUserGameData(username);
  return userObject.isInvalidGuess;
}

function setIsInvalidGuess(username, invalidGuess) {
  const userObject = getUserGameData(username);
  userObject.isInvalidGuess = invalidGuess;
}

function getInvalidGuessWord(username) {
  const userObject = getUserGameData(username);
  return userObject.invalidGuessWord;
}

function setInvalidGuessWord(username, guessWord) {
  const userObject = getUserGameData(username);
  userObject.invalidGuessWord = guessWord;
}

function getSecretWord(username) {
  const userObject = getUserGameData(username);
  return userObject.secretWord;
}

function setSecretWord(username, secretWord) {
  const userObject = getUserGameData(username);
  userObject.secretWord = secretWord;
}

function getWordList() {
  return wordList;
}

function pickWord() {
  return wordList[Math.floor(Math.random() * wordList.length)];
}

function compare(guessWord, secretWord) {
  let count = 0;
  let guessStr = guessWord;

  for (let letter of secretWord) {
    if (guessStr.includes(letter)) {
      count++;
      guessStr = guessStr.replace(letter, '');
    }
  }

  return count;
}


const gameModel = {
  wordList,
  users,
  currentUser,
  userGameData,

  addNewUser,
  updateLoginCountIfExistingUser,
  pickWord,
  compare,

  getCurrentUser,
  setCurrentUser,
  setIsInvalidUsername,
  getIsInvalidUsername,
  getUserGameData,
  setUserGameData,
  clearGameBoard,

  getLoginCount,
  setLoginCount,
  getPreviousGuessedList,
  setWordToPreviousGuessedList,
  getValidGuessCount,
  setValidGuessCount,
  getUserWonStatus,
  setUserWonStatus,
  getIsInvalidGuess,
  setIsInvalidGuess,
  getInvalidGuessWord,
  setInvalidGuessWord,
  wordAlreadyGuessed,

  getSecretWord,
  setSecretWord,
  getWordList,

};

module.exports = gameModel;