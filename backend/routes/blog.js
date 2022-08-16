const express = require("express");
const Blog = require("../models/blog");
const multer = require("multer");
const router = express.Router();

const storage = {
  dest: "../transitFiles/something.jpg",
};
const upload = multer(storage);

router.post("/dream-associated-img-upload", async (req, res) => {
  const blog = new Blog({
    title: "Something No_1",
    article: "Article blablabla!",
    img: upload.single("somethinG"),
  });

  blog
    .save()
    .then((result) => res.send(result))
    .catch((err) => {
      if (err) throw err;
    });
});

module.exports = router;
