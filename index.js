const mongoose = require("mongoose");
const path = require('path');
const express = require("express");

const app = express();

//ROUTES
const questionRoutes = require("./routes/question");
const indexPage = require('./routes/index');

//MODELS
const User = require('./models/user');



app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));


app.use(async(req, res, next) => {
  const user = await User.findOne();
  req.user = user;
  next();
})

app.use("/questions", questionRoutes);
app.use(indexPage);

mongoose
  .connect("mongodb://localhost/questionary", { useNewUrlParser: true })
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "Damjan",
        });
        user.save();
      }
    });
    
    app.listen(3000);
  })
  .catch(err => console.log(err));
