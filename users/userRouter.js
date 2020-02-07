const express = require("express");
const userDb = require("./userDb");
const postDb = require("../users/userDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  userDb
    .insert(req.body)
    .then(user => res.status(200).send(user))
    .catch(err =>
      res
        .status(500)
        .send({ message: "user was not added to the database", error: err })
    );
});

//! body shape?
router.post("/:id/posts", validatePost, (req, res) => {
  postDb
    .insert(req.body)
    .then(post => res.status(200).send(post))
    .catch(err =>
      res.status(500).send({ message: "post was not added", error: err })
    );
});

router.get("/", (req, res) => {
  userDb
    .get()
    .then(users => res.status(200).send(users))
    .catch(err =>
      res
        .status(500)
        .send({ message: "users could not be retrieved", error: err })
    );
});

router.get("/:id", validateUserId, (req, res) => {
  userDb
    .getById(req.params.id)
    .then(user =>
      // !user
      //   ? res
      //       .status(400)
      //       .send({ message: "user could not be found", error: err }) :
      res.status(200).send(user)
    )
    .catch(err =>
      res.status(500).send({ message: "user could not be found", error: err })
    );
});

router.get("/:id/posts", validateUserId, (req, res) => {
  userDb
    .getUserPosts(req.params.id)
    .then(posts =>
      !posts
        ? res.status(400).send({ message: "no posts found for this user" })
        : res.status(200).send(posts)
    )
    .catch(err => res.status(500).send({ errorMessage: err }));
});

router.delete("/:id", validateUserId, (req, res) => {
  userDb
    .remove(req.params.id)
    .then(record => {
      res.status(200).send({ message: `${record} records deleted` });
    })
    .catch(err =>
      res
        .status(500)
        .send({ message: "user could not be deleted", errorMessage: err })
    );
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  userDb
    .update(req.params.id, req.body)
    .then(user => {
      // !user
      //   ? res.status(400).send({ message: "no user was modified" }):
      res.status(200).send({ message: `${user} record modified` });
    })
    .catch(err =>
      res
        .status(500)
        .send({ message: "user could not be modified", errorMessage: err })
    );
});

//custom middleware
//? Why does this catch only work with the else statement
function validateUserId(req, res, next) {
  userDb
    .getById(req.params.id)
    .then(user => {
      user
        ? (req.user = user)
        : res.status(400).send({ message: "user ID not found", error: err });
    })
    .catch(err =>
      res.status(500).send({ message: "invalid user id", error: err })
    );
  next();
}
function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).send({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).send({ message: "missing required name field" });
  }
  next();
}
function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).send({ message: "missing post data." });
  } else if (!req.body.text) {
    res.status(400).send({ message: "missing required text field." });
  }
  next();
}

module.exports = router;
