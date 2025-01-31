const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("../pool");
const bcrypt = require("bcryptjs");

const customFields = {
  usernameField: "email",
  passwordField: "password",
};

const verifyCallback = async (username, password, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      username,
    ]);
    const user = rows[0];
    if (!user) {
      return done(null, false);
    }
    const match = password === user.password;
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
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err, false);
  }
});
