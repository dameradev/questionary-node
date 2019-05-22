const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const MONGODB_URI = "mongodb://localhost/questionary";
const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions"
});

//ROUTES
const questionRoutes = require("./routes/question");
const indexPage = require("./routes/index");
const authRoutes = require("./routes/auth");

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

app.use(async (req, res, next) => {
  const user = await User.findOne();
  req.user = user;
  next();
});

app.use("/questions", questionRoutes);
app.use(indexPage);
app.use(authRoutes);

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

    app.listen(3000);
  })
  .catch(err => console.log(err));
