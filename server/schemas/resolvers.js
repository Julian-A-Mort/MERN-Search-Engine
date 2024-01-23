const { AuthenticationError } = require('apollo-server-express');
const User = require('../models/User');
const { signToken } = require('../utils/auth'); 

const resolvers = {
  Query: {
    me: async (_, args, context) => {
      if (context.user) {
        return await User.findById(context.user._id).populate('savedBooks');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect details!');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect details!');
      }

      const token = signToken(user); 
      return { token, user };
    },

    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      if (!user) {
        throw new Error('Well that did not work!');
      }

      const token = signToken(user); 
      return { token, user };
    },

    saveBook: async (_, { input }, context) => {
      if (!context.user) {
        console.log('No user in context');
        throw new AuthenticationError('You need to be logged in!');
      }

      console.log('User ID:', context.user._id);
      console.log('Book to save:', input);

      try {
        const updatedUser = await User.findByIdAndUpdate(
          { _id:context.user._id},
          { $push: { savedBooks: input } }, 
          { new: true, runValidators: true }
        )

        console.log('Updated user:', updatedUser);
        return updatedUser;
      } catch (error) {
        console.error('Error in saveBook mutation:', error);
        throw new Error('Internal server error');
      }
    },

    removeBook: async (_, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        ).populate('savedBooks');

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
