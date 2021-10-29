const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URL

const params = new URLSearchParams(location.search);

const username = params.get("username");
const room = params.get("room");

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
	outputRoomName(room);
	outputUsers(users);
});

socket.on("message", (message) => {
	outputMessage(message);

	// Scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (event) => {
	event.preventDefault();

	// Get message text
	const msg = event.target.elements.msg.value;

	// Emit message to server
	socket.emit("chatMessage", msg);

	// Clear input
	event.target.elements.msg.value = "";
	event.target.elements.msg.focus();
});

// Output message to DOM

function outputMessage(message) {
	const div = document.createElement("div");

	div.classList.add("message");
	div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

	document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
	roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
	userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
}