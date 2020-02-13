const express = require("express");
const userDb = require("./users/userDb");
// const postDb = require("./users/postDb");
const userRoutes = require("./users/userRouter");
const postRoutes = require("./posts/postRouter");

const server = express();
// custom middleware
function logger(req, res, next) {
  console.log(`${req.method} to ${req.url} at [${new Date().toISOString()}]`);
  next();
}

const middleware = [express.json(), logger];
server.use(middleware);

server.use("/api/users", userRoutes);
server.use("/api/posts", postRoutes);

server.use((req, res) => res.send("fallback"));
server.listen(5000, () => console.log("server is listening on port 5000"));
