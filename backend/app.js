const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const path = require('path');

const app = express();
mongoose.connect("mongodb+srv://prayas:F4P9W6WxhjIFwvv0@cluster0-jy27y.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log("database connected succesfully");
  })
  .catch((res) => {
    console.log("connection failed" + res);
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use("/images", express.static(path.join("backend/images"))); //again run on server.js

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods",
  "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.use("/api/posts",postsRoutes);
module.exports = app;
