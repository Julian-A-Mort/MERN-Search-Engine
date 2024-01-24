const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Middleware for GraphQL authentication
  authMiddleware: function ({ req }) {
    let token = req.headers.authorization || '';
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trim();
    }

    if (!token) {
      req.isAuth = false;
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      req.isAuth = true;
    } catch (error) {
      req.isAuth = false;
      return req;
    }

    return req;
  },
  
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
