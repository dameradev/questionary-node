const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");

const app = express();

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

app.use(async (req, res, next) => {
  const user = await User.findOne();
  req.user = user;
  next();
});

app.use("/questions", questionRoutes);
app.use(indexPage);
app.use(authRoutes);

mongoose
  .connect("mongodb://localhost/questionary", { useNewUrlParser: true })
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
