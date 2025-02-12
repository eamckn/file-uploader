const router = require("express").Router();
const passport = require("passport");
const indexController = require("../controllers/indexController");

// GET routes
router.get("/", indexController.getHome);
router.get("/sign-up", indexController.getSignUp);
router.get("/log-in", indexController.getLogIn);
router.get("/log-out", indexController.logOut);
router.get("/new-folder", indexController.getNewFolder);

// POST routes
router.post("/sign-up", indexController.createUser);
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  })
);
router.post("/new-folder", indexController.createFolder);

module.exports = router;
