const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token and attach user to request object
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from 'Bearer <TOKEN>'
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database without password field
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.',
        });
      }

      next();
    } catch (error) {
      console.error('[Auth Middleware Error]:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

// Middleware for role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role || 'unknown'}' is not authorized to access this resource`,
      });
    }
    next();
  };
};

// Convenience helpers for specific roles
const isRecruiter = authorize('recruiter');
const isStudent = authorize('student');

module.exports = {
  protect,
  authorize,
  isRecruiter,
  isStudent,
};
