const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const GeneralInfo = require('../models/GeneralInfo');

exports.protect = asyncHandler(async (req, res, next) => {
  let token = null;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // we only ever issue tokens to the one admin user
    const user = await GeneralInfo.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized, token invalid');
  }
});
