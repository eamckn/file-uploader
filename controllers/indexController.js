const asyncHandler = require("express-async-handler");

// GET middlewares
module.exports.getHome = asyncHandler((req, res, next) => {
  res.render("index");
});

module.exports.getSignUp = asyncHandler((req, res, next) => {
  res.render("sign-up");
});

module.exports.getLogIn = asyncHandler((req, res, next) => {
  res.render("log-in");
});
