const path = require('path');
const express = require("express");

const app = express();

const questionRoutes = require("./routes/question");
const indexPage = require('./routes/index');

const mongoose = require("mongoose");



app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

app.use("/questions", questionRoutes);
app.use(indexPage)

mongoose
  .connect("mongodb://localhost/questionary", { useNewUrlParser: true })
  .then(result => {
    app.listen(3000);
  })
  .catch(err => console.log(err));
