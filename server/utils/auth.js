const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';
// Update the auth middleware function to work with the GraphQL API.
// The authMiddleware() function will execute with every request to the API.
// If the user is authenticated, the authMiddleware() function will simply
// move on and call the next() function. If the token cannot be verified,
// the function will return an error.
// The authMiddleware() function will be added as a second argument to the
// ApolloServer constructor function in server.js.


module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req }) {  // destructuring req so we can use the headers property
    // allows token to be sent via  req.query or headers
    let token = req.query.token || req.headers.authorization || req.body.token;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      console.log('No token found!');
      return req;
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: 'invalid token!' });
    }

    // send to next endpoint
    return req;
  },
  // function for our authenticated routes
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
