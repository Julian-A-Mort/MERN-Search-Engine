const jwt = require('jsonwebtoken');
const secret = 'secretsauce';

const authMiddleware = ({ req }) => {
  let token = req.headers.authorization || '';

  if (token) {
      token = token.split(' ').pop().trim();
  }

  if (!token) {
      return req; 
  }

  try {
      const data = jwt.verify(token, secret);
      req.user = data;
  } catch {
      console.log('Invalid token');
  }

  return req; 
};

const signToken = ({ _id, username, email }) => {
  const payload = { _id, username, email };
  return jwt.sign({ data: payload }, secret, { expiresIn: '2h' }); // Set an expiration for the token
};

module.exports = { authMiddleware, signToken };