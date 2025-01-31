// App imports
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("node:path");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./pool");
const passport = require("passport");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
require("./config/passport");

// App constants
const PORT = process.env.PORT || 8080;
const assetsPath = path.join(__dirname, "public");
const sessionStore = new pgSession({
  pool: pool,
});

// App initializations
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// App level middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));

app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    secret: "temp",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);
app.use(passport.session());
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

// Get routes
app.get("/", (req, res, next) => {
  res.render("index");
});
app.get("/sign-up", (req, res, next) => {
  res.render("sign-up");
});
app.get("/log-in", (req, res, next) => {
  res.render("log-in");
});

// Post routes
app.post("/sign-up", async (req, res, next) => {
  const { email, password } = req.body;
  await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
    email,
    password,
  ]);
  res.redirect("/");
});
app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  })
);

// App server
app.listen(PORT, () => {
  console.log(`Server is currently listening on port ${PORT}.`);
});
