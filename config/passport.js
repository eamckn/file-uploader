const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("../db/queries");

const customFields = {
  usernameField: "email",
  passwordField: "password",
};

const verifyCallback = async (username, password, done) => {
  try {
    const user = await db.getUserByEmail(username);
    if (!user) {
      return done(null, false);
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);

    done(null, user);
  } catch (err) {
    done(err, false);
  }
});
