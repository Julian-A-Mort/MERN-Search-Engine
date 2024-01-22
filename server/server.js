const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('../schemas');
const express = require('express');
const path = require('path');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Apollo Server
const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context: ({ req }) => {
  }
});
server.applyMiddleware({ app });

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Database connection and server start
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🌍 Now listening on localhost:${PORT}`);
  });
});