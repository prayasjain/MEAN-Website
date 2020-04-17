const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = (req,res,next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email : req.body.email,
      password : hash
    });

  user.save().then(result => {
    res.status(201).json({
      message : "UserCreated",
      result : result
    });
  })
  .catch(err => {
    res.status(500).json({
        message: "Invalid Auth Credentials"
    });
  });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({email : req.body.email})
  .then(user => {
    if (!user) {
      return res.status(401).json({
        message : "no such email"
      });
    }
    fetchedUser = user;

    return bcrypt.compare(req.body.password, user.password);
  }).then( (result) => {

    if(!result) {
      return res.status(401).json({
        message : "no such email"
      });
    }
    const token = jwt.sign(
      {email : fetchedUser.email, id : fetchedUser._id},
      process.env.JWT_KEY,
      {expiresIn: "1h"});

    res.status(200).json({
      message: "auth success",
      token : token,
      expiresIn : 3600,
      userId : fetchedUser._id
    });

  })
  .catch( error => {
    return res.status(401).json({
      message : "no such email"});
  });
};
