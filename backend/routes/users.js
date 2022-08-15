const { User, validate } = require("../models/user");
var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");

router.post("/", async (req, res) => {
  // First Validate The Request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if this user already exisits
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("That user already exisits!");
  else {
    // Insert the new user if they do not exist yet
    const salt = await bcrypt.genSalt(10);

    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
    });
    await user.save();
    // res.send(user);
    res.send(_.pick(user, ["_id", "name", "email"]));
  }
});

module.exports = router;
