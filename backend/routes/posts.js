const express = require('express');
const Post = require('../models/post');
const router = express.Router();

router.post("", (req, res, next) => {
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

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post)
    .then((result) => {
      res.status(200).json({
        message: "update success"
      });
    });

});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message : 'object not found'});
      }

    });
});

router.get('',(req, res, next) => {
//  res.send("hello from exporess");
  Post.find()
    .then((posts) => {
      res.status(200).json({
        message : 'fetch success',
        posts : posts
      });
    });

});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then((result) => {
      res.status(200).json({message : 'delete success'});
    });
});

module.exports = router;
