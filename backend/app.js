const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');

const Post = require('./models/post');

mongoose.connect("mongodb+srv://prayas:F4P9W6WxhjIFwvv0@cluster0-jy27y.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log("database connected succesfully");
  })
  .catch((res) => {
    console.log("connection failed" + res);
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods",
  "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then( (createdPost) => {
    res.status(201).json({
      message : "Post added success",
      postId : createdPost._id
    });
  });

});


app.get('/api/posts',(req, res, next) => {
//  res.send("hello from exporess");
  Post.find()
    .then((posts) => {
      console.log(posts);
      res.status(200).json({
        message : 'fetch success',
        posts : posts
      });
    });

});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then((result) => {
      console.log(result);
      res.status(200).json({message : 'delete success'});
    });
});

module.exports = app;
