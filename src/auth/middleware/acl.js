'use strict';

module.exports = (role) => {
  return (req, res, next) => {
    try {
      if (req.user.role === role) {
        next();
      } else {
        next('Access Denied');
      }
    } catch (e) {
      next('Invalid Login');
    }
  };
};
