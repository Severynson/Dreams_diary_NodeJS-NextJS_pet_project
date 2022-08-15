const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("config");

const { User } = require("../models/user");

const router = express.Router();

router.post("/", async (req, res) => {
  // First Validate The HTTP Request
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //  Now find the user by their email address
  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send("Incorrect email or password.");
  }

  // Then validate the Credentials in MongoDB match
  // those provided in the request
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Incorrect email or password.");
  }

  //   const token = jwt.sign({ _id: user._id }, "PrivateKey");
  const token = jwt.sign({ _id: user._id }, config.get("PrivateKey"));
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
}

// router.get("/:logInData", (req, res) => {
//   User.findOne(
//     { email: req.body.email, password: req.body.password },
//     (err, user) => {
//       if (err) throw err;
//       else if (!user) res.send("Wrong email or password!");
//       // else res.send(_.pick(user, ["_id", "name", "email"]));
//       else res.send(true);
//     }
//   );
// });

module.exports = router;
