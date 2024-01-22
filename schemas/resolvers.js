const { AuthenticationError } = require('apollo-server-express');
const User = require('../models/User');

const resolvers = {
  Query: {
    me: async (_, args, context) => {
      if (context.user) {
        return await User.findById(context.user._id);
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    login: async (_, { email, password }) => {
    },

    addUser: async (_, { username, email, password }) => {
    },

    saveBook: async (_, { input }, context) => {
      if (context.user) {
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    removeBook: async (_, { bookId }, context) => {
      if (context.user) {
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
