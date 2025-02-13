// GET middlewares
module.exports.getHome = (req, res, next) => {
  res.render("index");
};

module.exports.getSignUp = (req, res, next) => {
  res.render("sign-up");
};

module.exports.getLogIn = (req, res, next) => {
  res.render("log-in");
};
