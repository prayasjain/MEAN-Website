const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Method",
  "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message : "Post added success"
  });
});


app.get('/api/posts',(req, res, next) => {
//  res.send("hello from exporess");
const posts = [
  { id : 'sdjs',
   title : 'First post title',
   content : 'first post content'
  },
  { id : 'sdjsds',
   title : 'second post title',
   content : 'second post content'
  }
];
res.status(200).json({
  message : 'fetch success',
  posts : posts
});
});

module.exports = app;
