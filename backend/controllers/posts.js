const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.id
  });
  post.save().then( (createdPost) => {
    res.status(201).json({
      message : "Post added success",
      post : {
        ...createdPost,
        id : createdPost._id,
      }
    });
  }).catch(err => {
    res.status(500).json({
      message : "post creating failed"
    });
  });
};

exports.updatePost =(req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath= url + "/images/" + req.file.filename;

  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator : req.userData.id
  });
  Post.updateOne({_id: req.params.id, creator: req.userData.id}, post)
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "update success",
          post: {
            ...post,
            id: req.params.id
          }
        });
      } else {
        res.status(401).json({
          message: "not authorized",
          post: {
            ...post,
            id: req.params.id
          }
        });
      }
    }).catch(err => {
      res.status(500).json({
        message: "couldnt update post"
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message : 'object not found'});
      }
    }).catch(err => {
      res.status(500).json({
        message: "post fetch failed"
      });
    });
};

exports.getAllPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currPage = +req.query.currPage;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currPage) {
    postQuery
      .skip(pageSize*(currPage - 1))
      .limit(pageSize);
  }
  postQuery.then((posts) => {
    fetchedPosts = posts;
    return Post.count();

  }).then(count => {
    res.status(200).json({
      message : 'fetch success',
      posts : fetchedPosts,
      maxPosts : count
    });
  }).catch(err => {
    res.status(500).json({
      message: "post fetch failed"
    });
  });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.id})
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({message : 'delete success'});
      } else {
        res.status(401).json({message : 'unauthorized'});
      }
    }).catch(err => {
      res.status(500).json({
        message: "post delete failed"
      });
    });
};

