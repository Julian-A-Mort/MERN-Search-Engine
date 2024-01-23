const jwt = require('jsonwebtoken');
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const mongoose = require('mongoose');

const typeDefs = require('../server/schemas/typeDefs'); // Import your GraphQL type definitions
const resolvers = require('../server/schemas/resolvers'); // Import your GraphQL resolvers

const secret = 'secretsauce'; // Define your secret key

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware, // Apply auth middleware to the context
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/your-database-name', {
//   useCreateIndex: true,
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// mongoose.connection.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// Start the Apollo Server
async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app }); // Apply middleware after the server is started
}

startApolloServer();

// // Serve static files in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/dist')));

//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
//   });
// }

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
  console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
});
