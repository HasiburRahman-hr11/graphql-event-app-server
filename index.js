const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const isAuth = require('./middleware/is-auth');

const { default: mongoose } = require("mongoose");


const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');

require("dotenv").config();

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true, // This is to debug GraphQL in development mode.
  })
);

/*
## In buildSchema function keywords (schema, rootValue, query and mutation) are fixed. You can't change this keywords.
## rootQuery and rootMutation are changeable. 

*/

const PORT = 4000;

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4wx25kf.mongodb.net/${process.env.DB_NAME}?retryWrites=true`
  )
  .then(() => {
    console.log("Database Connected Successfully!");

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
