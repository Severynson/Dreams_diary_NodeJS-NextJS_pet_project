var createError = require("http-errors");
var express = require("express");
var path = require("path");

var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const config = require("config");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const blogRouter = require("./routes/blog");

var app = express();

if (!config.get("PrivateKey")) {
  console.error("FATAL ERROR: PrivateKey is not defined.");
  process.exit(1);
}

mongoose
  .connect(
    "mongodb+srv://test:test@diaryofdreams.ns883.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Now connected to MongoDB!"))
  .catch((err) => console.error("Something went wrong", err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/blog", blogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
