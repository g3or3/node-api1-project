// BUILD YOUR SERVER HERE

const express = require("express");
const Users = require("./users/model");

const server = express();

server.use(express.json());

server.get("/api/users", async (req, res) => {
	try {
		const users = await Users.find();
		res.json(users);
	} catch (err) {
		res.status(500).json({
			message: "Error while trying to retrieve users.",
		});
	}
});

server.get("/api/users/:id", async (req, res) => {
	try {
		const user = await Users.findById(req.params.id);
		if (!user) {
			res.status(404).json({ message: "User not found." });
		} else res.json(user);
	} catch (err) {
		res.status(500).json({
			message: "Error while trying to retrieve user.",
		});
	}
});

server.post("/api/users", async (req, res) => {
	if (!req.body.name || !req.body.bio) {
		res.status(400).json({ message: "Missing field." });
	}
	try {
		const newUser = await Users.insert(req.body);
		res.status(201).json(newUser);
	} catch (err) {
		res.status(500).json({
			message: "Error while trying to add new user.",
		});
	}
});

server.put("/api/users/:id", async (req, res) => {
	if (!req.body.name || !req.body.bio) {
		res.status(422).json({ message: "Missing field." });
	}
	try {
		const updatedUser = await Users.update(req.params.id, req.body);
		if (!updatedUser) {
			res.status(404).json({ message: "User not found." });
		} else {
			res.json(updatedUser);
		}
	} catch (err) {
		res.status(500).json({ message: "Error while trying to update user." });
	}
});

server.delete("/api/users/:id", async (req, res) => {
	try {
		const userToRemove = await Users.remove(req.params.id);
		if (!userToRemove) {
			res.status(404).json({ message: "User not found." });
		} else {
			res.json(userToRemove);
		}
	} catch (err) {
		res.status(500).json({ message: "Error while trying to remove user." });
	}
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
