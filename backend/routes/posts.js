const express = require('express');
const router = express.Router();

const PostsController = require('../controllers/posts');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

router.post("",
  checkAuth,
  extractFile,
  PostsController.createPost);

router.put('/:id' ,
  checkAuth,
  extractFile,
  PostsController.updatePost);

router.get('/:id', PostsController.getPost);

router.get('', PostsController.getAllPosts);

router.delete('/:id', checkAuth, PostsController.deletePost);

module.exports = router;
