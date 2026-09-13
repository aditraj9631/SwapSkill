const form = document.querySelector("form");

const pass = document.querySelector("#password");
const confPass = document.querySelector("#confirmPassword");

form.addEventListener("submit", function (event) {

    if (pass.value.length < 8) {
        event.preventDefault();
        alert("Password must be at least 8 characters.");
        return;
    }

    if (pass.value !== confPass.value) {
        event.preventDefault();
        alert("Passwords do not match.");
        return;
    }

});