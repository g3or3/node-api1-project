import React, { useEffect, useState } from "react";

function App() {
	const [users, setUsers] = useState([]);
	const [editingUser, setEditingUser] = useState(null);
	const [removedUsers, setRemovedUsers] = useState([]);
	const [formVals, setFormVals] = useState({ name: "", bio: "" });
	const [editFormVals, setEditFormVals] = useState({ name: "", bio: "" });

	useEffect(() => {
		fetch("http://localhost:5000/api/users")
			.then((res) => res.json())
			.then((data) => setUsers(data));
	}, []);

	useEffect(() => {
		if (editingUser)
			setEditFormVals({
				name: editingUser.name,
				bio: editingUser.bio,
			});
	}, [editingUser]);

	const handleChange = (e) => {
		if (e.target.name === "name" || e.target.name === "bio")
			setFormVals({ ...formVals, [e.target.name]: e.target.value });
		else {
			if (e.target.name === "editname") {
				setEditFormVals({
					...editFormVals,
					name: e.target.value,
				});
			} else {
				setEditFormVals({
					...editFormVals,
					bio: e.target.value,
				});
			}
		}
	};

	const handleAdd = (e, newUser) => {
		e.preventDefault();

		fetch("http://localhost:5000/api/users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newUser),
		})
			.then((response) => response.json())
			.then((data) => {
				setUsers([...users, data]);
				setFormVals({ name: "", bio: "" });
			});
	};

	const handleEdit = (e, id) => {
		e.preventDefault();

		fetch(`http://localhost:5000/api/users/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(editFormVals),
		})
			.then((response) => response.json())
			.then((data) => {
				setUsers(
					users.map((user) => {
						if (user.id === data.id) return data;
						return user;
					})
				);
				setEditFormVals({ name: "", bio: "" });
				setEditingUser(null);
			});
	};

	const handleRemove = (id) => {
		fetch(`http://localhost:5000/api/users/${id}`, {
			method: "DELETE",
		})
			.then((response) => response.json())
			.then((data) => {
				setUsers(users.filter((user) => user.id !== data.id));
				setRemovedUsers((removedUsers) => [...removedUsers, data]);
			});
	};

	const handleUndo = (e) => {
		const lastRemovedUser = removedUsers.pop();
		handleAdd(e, lastRemovedUser);
		setRemovedUsers(removedUsers);
	};

	return (
		<div style={{ width: "40%", margin: "8% auto 5%" }}>
			<form
				onSubmit={(e) => handleAdd(e, formVals)}
				style={{
					marginBottom: "20%",
					border: "1px solid",
					width: "85%",
					padding: "5%",
				}}
			>
				<label>
					Name:
					<br></br>
					<input
						name="name"
						value={formVals.name}
						onChange={handleChange}
					/>
				</label>
				<br></br>
				<label>
					Bio:
					<br></br>
					<textarea
						style={{ marginBottom: "5%" }}
						name="bio"
						value={formVals.bio}
						onChange={handleChange}
					/>
				</label>
				<br></br>
				<button>Add New User</button>
				{removedUsers?.length !== 0 ? (
					<button type="button" onClick={handleUndo}>
						Undo Remove
					</button>
				) : null}
			</form>

			{users.map((user) => (
				<div key={user.id}>
					<h1>{user.name}</h1>
					<p>{user.bio}</p>
					<button onClick={() => setEditingUser(user)}>Edit</button>
					<button onClick={() => handleRemove(user.id)}>
						Remove
					</button>

					{editingUser?.id === user.id ? (
						<form onSubmit={(e) => handleEdit(e, editingUser.id)}>
							<label>
								Name:
								<br></br>
								<input
									name="editname"
									value={editFormVals.name}
									onChange={handleChange}
								/>
							</label>
							<br></br>
							<label>
								Bio:
								<br></br>
								<textarea
									name="editbio"
									value={editFormVals.bio}
									onChange={handleChange}
								/>
							</label>
							<br></br>
							<button>Submit</button>
							<button
								type="button"
								onClick={() => setEditingUser(null)}
							>
								Cancel
							</button>
						</form>
					) : null}
				</div>
			))}
		</div>
	);
}

export default App;
