const express = require('express');
const path = require('path');

const { ApolloServer } = require('@apollo/server');
const { typeDefs, resolvers } = require('./schemas');

const { authMiddleware } = require("./utils/auth");

const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// add apollo middleware
const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });
  await server.start();
  server.applyMiddleware({ app });
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

startApolloServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(`/graphql`, expressMiddleware(server));

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍🚀 Now listening on localhost:${PORT}`));
  console.log(`📭Use GraphQL at http://localhost:${PORT}/graphql`);
});
