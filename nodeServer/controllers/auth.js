const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
require('dotenv').config();

const {
  errorHandler
} = require('../utils/ErrorDB');

exports.signup = async (req, res) => {
  const userExists = await User.findOne({
    email: req.body.email
  });
  if (userExists)
    return res.status(403).json({
      error: 'Email is taken!'
    });
  const user = await new User(req.body);
  await user.save();
  res.status(200).json({
    user
  });
};

exports.signin = async (req, res) => {
  // find the user based on email
  const {
    email,
    password
  } = req.body;
  const user = await User.findOne({
    email: req.body.email
  });
  if (!user)
    return res.status(401).json({
      error: 'User with that email does not exist. Please signup.'
    });
  if (!user.authenticate(password)) {
    return res.status(401).json({
      error: 'Email and password do not match'
    });
  }
  const token = jwt.sign({
      _id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET
  );
  res.cookie('jwt', token, {
    maxAge: 2 * 60 * 60 * 1000,
    httpOnly: true
  });
  const {
    _id,
    name,
    role
  } = user;
  return res.json({
    token,
    user: {
      _id,
      email,
      name,
      role
    }
  });
};

exports.signout = async (req, res) => {
  res.clearCookie('jwt');
  return res.json({
    message: 'Signout success!'
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'auth'
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: 'Access denied'
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: 'Admin only, Access Denied'
    });
  }
  next();
};