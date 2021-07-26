const users = [];

// Join user to chat
function userJoin(id, username, room) {
	const user = { id, username, room };

	const userIsExists = users.findIndex((user) => user.username === username);

	if (userIsExists !== -1) {
		users[userIsExists] = user;
	} else {
		users.push(user);
	}

	return user;
}

function getCurrentUser(id) {
	return users.find((user) => user.id === id);
}

function userLeave(id) {
	const userIndex = users.findIndex((user) => user.id === id);

	if (userIndex !== -1) {
		return users[userIndex];
	}
}

function getRoomUsers(room) {
	return users.filter((user) => user.room === room);
}

module.exports = {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
};
