$(() => {
  console.log("ready!");
  const errbar = document.getElementById("login-error");
  const form = document.getElementById("login-form");
  const nameFirst = document.getElementById("login-name-first");
  const nameLast = document.getElementById("login-name-last");
  const email = document.getElementById("login-email");
  const pass = document.getElementById("login-password");
  const submit = document.getElementById("login-submit");
  const tos = document.querySelector("#login-tos");
  const confirm = document.getElementById("login-confirm");
  submit.addEventListener("click", (event) => {
    event.preventDefault();
    const firstName = nameFirst.value;
    const lastName = nameLast.value;
    const password = pass.value;
    const emaile = email.value;
    const confpass = confirm.value;
    const readTos = tos.checked;
    const selectedAge = document.querySelector("input[name='age']:checked")?.value;
    if (!firstName || !lastName || !password || !email || !confpass) {
      errbar.innerHTML = "All fields needed.";
      errbar.style.opacity = 1;
      return;
    }
    if (confpass != password) {
      errbar.innerHTML = "Passwords do not match.";
      errbar.style.opacity = 1;
      // pass.value = "";
      confirm.value = "";
      return;
    }
    if (password.length < 6) {
      errbar.innerHTML = "Password must be at least 6 characters long.";
      errbar.style.opacity = 1;
      // pass.value = "";
      confirm.value = "";
      return;
    }
    if (!readTos) {
      errbar.innerHTML = "Please agree to our terms of service before registering!";
      errbar.style.opacity = 1;
      return;
    }
    if (!selectedAge) {
      errbar.innerHTML = "Please select an age group!";
      errbar.style.opacity = 1;
      return;
    }
    var info = { name: { first: firstName, last: lastName }, pass: password, email: emaile };
    $.ajax({
      type: "POST",
      url: "/api/auth/register",
      data: info,
      xhrFields: {
        withCredentials: true,
      },
      success: function (xhr, status, error) {
        console.log("success");
        const search = new URLSearchParams(location.search);
        const newSearch = new URLSearchParams();
        if (search.has("next")) {
          newSearch.set("next", search.get("next"));
        }
        location.replace(`/emailsent?${newSearch}`);
      },
      error: function (xhr, status, error) {
        console.log(xhr.responseJSON.message);
        errbar.innerHTML = xhr.responseJSON.message;
        errbar.style.opacity = 1;
      },
    });
  });
});
