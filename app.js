const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const https = require("https");
const mongoose = require('mongoose');
const dotenv = require("dotenv");


//setting views
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));


dotenv.config();

//Database connection
const dbUrl = "mongodb+srv://" + process.env.DB_USERNAME + ":" +process.env.DB_PASSWORD+"@cybercitycluster.wvp0r.mongodb.net/comicViews?retryWrites=true/counts";

//mongoose.connect(strings.dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Database connected!"))
  .catch(err => console.log(err));

//Schema
const Count = require(__dirname+ "/public/dbHandler/ComicViews.js");


const ApiHandler = require('./public/Api/ApiHandler');

//Home route
app.get("/", function(req, res) {
  const homeURL = 'https://xkcd.com/info.0.json';
  ApiHandler(homeURL, res, Count);
});

//Other comic strips route
app.get("/:num", function(req, res){
    const num = req.params.num;
    const comicURL = "https://xkcd.com/" + num + "/info.0.json";
    ApiHandler(comicURL, res, Count);
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running");
});
