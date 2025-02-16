// App imports
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("node:path");
const passport = require("passport");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
require("./config/passport");
const indexRouter = require("./routes/indexRouter");
const foldersRouter = require("./routes/foldersRouter");

// App constants
const PORT = process.env.PORT || 8080;
const assetsPath = path.join(__dirname, "public");
const sessionStore = new PrismaSessionStore(new PrismaClient(), {
  checkPeriod: 2 * 60 * 1000, //ms
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

// App initializations
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// App level middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));

// Express-session and passport
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

// Set res.locals for template renders
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use((req, res, next) => {
  if (req.session.messages) {
    res.locals.failureMessage = req.session.messages[0];
  }
  next();
});

// Authentication debugging middlewares
// app.use((req, res, next) => {
//   console.log(req.session);
//   console.log(req.user);
//   next();
// });

app.use("/folders", foldersRouter);
app.use("/", indexRouter);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).render("errorRedirect", { err: err });
});

// Invalid route request handler middleware
app.use((req, res, next) => {
  res.status(404).render("404");
});

// App server
app.listen(PORT, () => {
  console.log(`Server is currently listening on port ${PORT}.`);
});
