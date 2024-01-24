import React from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink, } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import Navbar from './components/Navbar';

// HTTP connection to the GraphQL API
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

// Authentication link
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Set up Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    // Wrap your app with ApolloProvider
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
