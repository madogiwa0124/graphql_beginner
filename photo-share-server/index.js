console.log("hello!");

// init DB
const { MongoClient } = require("mongodb");
const initDatabase = async (config) => {
  const client = await MongoClient.connect(config, { useNewUrlParser: true });
  return client.db();
};

// init App
const express = require("express");
const app = express();
const expressPlayground = require("graphql-playground-middleware-express").default;
app.get("/", (req, res) => res.end(`Wellcome to the PhotoShare API`));
app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

// init graphql server
const { ApolloServer } = require("apollo-server-express");
const { readFileSync } = require("fs");
const typeDefs = readFileSync("./typeDefs.graphql", "UTF-8");
const resolvers = require("./resolvers");

const startServer = async (app, port) => {
  const db = await initDatabase(process.env.DB_HOST);
  const currentUser = async (githubToken, db) => await db.collection(`users`).findOne({ githubToken });
  const context = async ({ req }) => ({ db: db, currentUser: await currentUser(req.headers.authorization, db) });
  const server = new ApolloServer({ typeDefs, resolvers, context });
  await server.start();
  server.applyMiddleware({ app });
  app.listen({ port }, () => {
    console.log(`GraphQL running @ http://localhost:4000${server.graphqlPath}`);
  });
};

startServer(app, 4000);
