const router = require("express").Router();

const User = require("./users-model");

router.get("/", async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (err) {
		res.status(500).json({
			message: "Error while trying to retrieve users.",
		});
	}
});

router.get("/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			res.status(404).json({ message: "User not found." });
		} else res.json(user);
	} catch (err) {
		res.status(500).json({
			message: "Error while trying to retrieve user.",
		});
	}
});

router.post("/", async (req, res) => {
	if (!req.body.name || !req.body.bio) {
		res.status(400).json({ message: "Missing field." });
	} else {
		try {
			const newUser = await User.insert(req.body);
			res.status(201).json(newUser);
		} catch (err) {
			res.status(500).json({
				message: "Error while trying to add new user.",
			});
		}
	}
});

router.put("/:id", async (req, res) => {
	if (!req.body.name || !req.body.bio) {
		res.status(422).json({ message: "Missing field." });
	} else {
		try {
			const updatedUser = await User.update(req.params.id, req.body);
			if (!updatedUser) {
				res.status(404).json({ message: "User not found." });
			} else {
				res.json(updatedUser);
			}
		} catch (err) {
			res.status(500).json({
				message: "Error while trying to update user.",
			});
		}
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const userToRemove = await User.remove(req.params.id);
		if (!userToRemove) {
			res.status(404).json({ message: "User not found." });
		} else {
			res.json(userToRemove);
		}
	} catch (err) {
		res.status(500).json({ message: "Error while trying to remove user." });
	}
});

module.exports = router;
