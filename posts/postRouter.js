const express = require("express");
const postDb = require("./postDb");

const router = express.Router();

router.get("/", (req, res) => {
  postDb
    .get()
    .then(posts => res.status(200).send(posts))
    .catch(err =>
      res.status(500).send({ message: "could not retrieve posts", error: err })
    );
});

router.get("/:id", validatePostId, (req, res) => {
  postDb
    .getById(req.params.id)
    .then(post => res.status(200).send(post))
    .catch(err =>
      res
        .status(500)
        .send({ message: "could not retrieve post at this time", error: err })
    );
});

router.delete("/:id", validatePostId, (req, res) => {
  postDb
    .remove(req.params.id)
    .then(record => {
      res.status(200).send({ message: `${record} records deleted` });
    })
    .catch(err =>
      res
        .status(500)
        .send({ message: "post could not be deleted", errorMessage: err })
    );
});

router.put("/:id", validatePostId, validatePost, (req, res) => {
  postDb
    .update(req.params.id, req.body)
    .then(post => {
      res.status(200).send({ message: `${post} record modified` });
    })
    .catch(err =>
      res
        .status(500)
        .send({ message: "post could not be modified", errorMessage: err })
    );
});

// custom middleware

function validatePostId(req, res, next) {
  postDb
    .getById(req.params.id)
    .then(post => {
      if (!post) {
        res.status(400).send({ message: "Post with the ID was not found" });
      }
    })
    .catch(err =>
      res.status(500).send({ message: "Unable to retrieve post", error: err })
    );
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
