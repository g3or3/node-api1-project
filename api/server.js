// BUILD YOUR SERVER HERE

const express = require("express");
const cors = require("cors");

const usersRouter = require("./users/users-router");

const server = express();

server.use(express.json());
server.use(cors());
server.use("/api/users", usersRouter);

module.exports = server; // EXPORT YOUR SERVER instead of {}
