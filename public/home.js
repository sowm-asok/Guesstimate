"use strict";
(function () {
  const guessInput = document.querySelector(".guess");
  const guessForm = document.querySelector(".guess-form");
  const wordList = guessInput.dataset.words;

  guessForm.addEventListener('submit', (e) => {
    if (guessInput.value === "" || guessInput.value.length !== 5 || !wordList.includes(guessInput.value)) {
      e.preventDefault();
      if (guessForm.getElementsByClassName('client-error-message').length === 0) {
        let errorMessage = document.createElement('p');
        errorMessage.classList.add('client-error-message');
        errorMessage.textContent = "Please guess a word from the GuessWord list";
        guessForm.appendChild(errorMessage);
      }
    }
  });

})();