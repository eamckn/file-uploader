const router = require("express").Router();
const passport = require("passport");
const indexController = require("../controllers/indexController");
const usersController = require("../controllers/usersController");
const foldersController = require("../controllers/foldersController");

// GET routes
router.get("/", indexController.getHome);
router.get("/sign-up", indexController.getSignUp);
router.get("/log-in", indexController.getLogIn);
router.get("/log-out", usersController.logOut);

// POST routes
router.post("/sign-up", usersController.createUser);
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  })
);

module.exports = router;
