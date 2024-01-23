const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('../schemas');
const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Apollo Server
const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context: ({ req }) => authMiddleware({ req }),
});

// Start the Apollo server and apply it to our Express app
async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });


// Database connection and server start
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🌍 Now listening on localhost:${PORT}`);
  });
});
}

// Call the async function to start the server
startApolloServer();