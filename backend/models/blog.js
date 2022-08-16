const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Blog",
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 30,
      },
      article: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 30000,
      },
      img: {
        data: Buffer,
        contentType: String,
      },
    },
    { timestamps: true }
  )
);
