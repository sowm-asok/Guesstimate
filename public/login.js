"use strict";
(function () {
  const loginButton = document.querySelector(".login");
  const usernameInput = document.querySelector(".username");

  loginButton.disabled = true;

  usernameInput.addEventListener('input', () => {
    if (usernameInput.value === "") {
      loginButton.disabled = true;
    }
    else {
      loginButton.disabled = false;
    }
  });

})();