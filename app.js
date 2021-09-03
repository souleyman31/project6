const express = require("express");

const mongoose = require("mongoose");
require("dotenv/config");

const path = require("path");
const helmet = require("helmet");
const nocache = require("nocache");

//MONGOOSE CONNECT
mongoose
  .connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//INSTALLATION EXPRESS
const app = express();

//ERROR CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

//BODYPARSER USE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//HELMET AND NOCACHE
app.use(helmet());
app.use(nocache());

//ROUTES
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", require("./routes/sauce"));

app.use("/api/auth", require("./routes/user"));

module.exports = app;
