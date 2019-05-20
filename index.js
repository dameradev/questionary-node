const express = require("express");

const app = express();

const questionRoutes = require("./routes/question");

const mongoose = require("mongoose");

app.use("/questions", questionRoutes);

app.set("view engine", "ejs");
app.set("views", "views");

mongoose
  .connect("mongodb://localhost/questionary", { useNewUrlParser: true })
  .then(result => {
    app.listen(3000);
  })
  .catch(err => console.log(err));
