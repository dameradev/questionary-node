const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const MONGODB_URI = "mongodb://localhost/questionary";
const csrf = require("csurf");
const flash = require("connect-flash");

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions"
});
const csrfProtection = csrf();

//ROUTES
const questionRoutes = require("./routes/question");
const indexPage = require("./routes/index");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");

//MODELS
const User = require("./models/user");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use(async (req, res, next) => {
  const user = await User.findOne();
  req.user = user;
  next();
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/questions", questionRoutes);
app.use(indexPage);
app.use(authRoutes);
app.use(categoryRoutes);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "Damjan"
        });
        user.save();
      }
    });

    app.listen(3002);
  })
  .catch(err => console.log(err));
