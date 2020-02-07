const express = require("express");
const postDb = require("./postDb");

const router = express.Router();

router.get("/", (req, res) => {});

router.get("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

// custom middleware

function validatePostId(req, res, next) {
  postDb
    .getById(req.params.id)
    .then(post => console.log(post))
    .catch(err => res.status(400).send({ message: "invalid post id" }));
  next();
}

module.exports = router;
