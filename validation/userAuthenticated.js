module.exports.userAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).render("unauthenticated");
  }
};
