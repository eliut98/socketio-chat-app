const socket = io();

let message = document.getElementById("message");
let username = document.getElementById("username");
let btnSend = document.getElementById("send");
let chatOutput = document.querySelector(".chat__output");
let chatActions = document.querySelector(".chat__actions");
let registerWindow = document.querySelector(".register-user");

if (!sessionStorage.getItem("username")) {
  registerUser();
}

function registerUser() {
  registerWindow.style.display = "flex";
  username.addEventListener("keypress", function(ev) {
    if (ev.keyCode == 13) {
      sessionStorage.setItem("username", username.value);
      registerWindow.style.display = "none";
    }
  });
}

function getUser() {
  return sessionStorage.getItem("username");
}

function sendMessage() {
  socket.emit("message", {
    message: message.value,
    username: getUser()
  });
  message.value = "";
}

btnSend.addEventListener("click", function() {
  sendMessage();
});

message.addEventListener("keypress", function(ev) {
  socket.emit("typing", getUser());
  if (ev.keyCode == 13) {
    sendMessage();
  }
});

socket.on("messageServer", data => {
  chatActions.innerHTML = "";

  if (data.username == getUser()) {
    chatOutput.innerHTML += `
    <div class="chat__label me">
    <strong class="chat__username">${data.username}</strong>
      ${data.message}
    </div>
  `;
  } else {
    chatOutput.innerHTML += `
    <div class="chat__label other">
    <strong class="chat__username">${data.username}</strong>
      ${data.message}
    </div>
  `;
  }
});

socket.on("userTyping", user => {
  chatActions.innerHTML = `<p><em>${user} is typing...</em></p>`;
});
