const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const formatMessage = require("./utils/messages");
const {
	getCurrentUser,
	userJoin,
	getRoomUsers,
	userLeave,
} = require("./utils/users");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord Bot";

// Runs when client connect
io.on("connection", (socket) => {
	console.log("New WS Connection...");

	socket.on("joinRoom", ({ username, room }) => {
		const user = userJoin(socket.id, username, room);

		socket.join(user.room);

		socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

		// Broadcast when a user connects
		socket.broadcast
			.to(user.room)
			.emit(
				"message",
				formatMessage(botName, `${user.username} has joined the chat`),
			);

		// Send users and room info
		io.to(user.room).emit("roomUsers", {
			room: user.room,
			users: getRoomUsers(user.room),
		});
	});

	// Listen for chat message
	socket.on("chatMessage", (message) => {
		const user = getCurrentUser(socket.id);

		io.to(user.room).emit("message", formatMessage(user.username, message));
	});

	socket.on("disconnect", () => {
		const user = userLeave(socket.id);

		if (user) {
			io.to(user.room).emit(
				"message",
				formatMessage(botName, `${user.username} has left the chat`),
			);

			// Send users and room info
			io.to(user.room).emit("roomUsers", {
				room: user.room,
				users: getRoomUsers(user.room),
			});
		}
	});
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
