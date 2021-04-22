'use strict';

module.exports = () => {

  return (req, res, next) => {

    try {
      if (req.user.role === 'admin') {
        next();
      }
      else {
        next('Access Denied');
      }
    } catch (e) {
      next('Invalid Login');
    }

  }

}