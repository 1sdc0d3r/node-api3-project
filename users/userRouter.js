const express = require("express");
const userDb = require("./userDb");

const router = express.Router();

router.post("/", (req, res) => {});

router.post("/:id/posts", (req, res) => {});

router.get("/", (req, res) => {});

router.get("/:id", (req, res) => {});

router.get("/:id/posts", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

//custom middleware

function validateUserId(req, res, next) {
  userDb
    .getById(req.params.id)
    .then(user => (req.user = user))
    .catch(err => res.status(400).send({ message: "invalid user id" }));
}
function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).send({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).send({ message: "missing required name field" });
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).send({ message: "missing post data." });
  } else if (!req.body.text) {
    res.status(400).send({ message: "missing required text field." });
  }
}

module.exports = router;
