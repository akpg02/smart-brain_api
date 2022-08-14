const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const knex = require("knex");
const { handleRegister, handleSignin } = require("./controllers/auth");
const {
  handleProfileGet,
  handleImage,
  handleApiCall,
} = require("./controllers/user");

//db
const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

const app = express();

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.json({ message: "This is working" });
});

app.post("/signin", (req, res) => handleSignin(req, res, db, bcrypt));

app.post("/register", (req, res) =>
  handleRegister(req, res, db, bcrypt, saltRounds)
);

app.get("/profile/:id", (req, res) => handleProfileGet(req, res, db));

app.put("/image", (req, res) => handleImage(req, res, db));
app.post("/imageurl", (req, res) => handleApiCall(req, res));

// set port
const port = process.env.PORT || 3020;

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
