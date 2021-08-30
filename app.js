const express = require("express");

const mongoose = require("mongoose");
require("dotenv/config");

const app = express();

//MONGOOSE CONNECT
// mongoose.set("useNewUrlParser", true);
// mongoose.set("useFindAndModify", false);
// mongoose.set("useCreateIndex", true);

mongoose
  .connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.get("/", (req, res) => {
  res.send("Hello world");
});

module.exports = app;
