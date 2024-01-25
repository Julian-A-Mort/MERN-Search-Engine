const { AuthenticationError } = require('apollo-server-express');
const User = require('../models/User');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (_, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      return await User.findById(context.user._id).populate('savedBooks');
    },
  },

  Mutation: {
    login: async (_, { email, password }) => {
      console.log(`Attempting to login user: ${email}`);
      const user = await User.findOne({ email });
      if (!user) {
        console.error('No user found with this email');
        throw new AuthenticationError('Incorrect details!');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        console.error('Incorrect password');
        throw new AuthenticationError('Incorrect details!');
      }

      const token = signToken(user);
      console.log(`Generated token: ${token}`);
      return { token, user };
    },

    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      if (!user) {
        throw new Error('User creation failed');
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (_, { input }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: input } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },

    removeBook: async (_, { bookId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      ).populate('savedBooks');
      return updatedUser;
    },
  },
};

module.exports = resolvers;
