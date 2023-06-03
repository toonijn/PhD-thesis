// on submit send all fields of the form #register-form as json to process.php
// report any errors or display success message. (Use fetch api)

const registerForm = document.getElementById("register-form");
const registerPage = document.getElementById("register-page");
const registerError = document.getElementById("register-error");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(registerForm);

  fetch("process.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      if (!res.success) throw new Error(res.message);

      registerPage.classList.add("register-is-success");
      registerPage.classList.remove("register-has-error");
      registerError.innerHTML = "";
      registerForm.reset();
    })
    .catch((err) => {
      console.log(err);
      registerPage.classList.remove("register-is-success");
      registerPage.classList.add("register-has-error");
      registerError.innerHTML = err.message;
    });
});
