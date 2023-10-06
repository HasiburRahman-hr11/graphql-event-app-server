const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const { default: mongoose } = require("mongoose");

const Event = require("./models/Event");

require("dotenv").config();

const app = express();

app.use(bodyParser.json());


app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input CreateEventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type rootQuery {
            events : [Event!]!
        }

        type rootMutation {
            createEvent(eventInput:CreateEventInput) : Event
        }

        schema {
            query: rootQuery
            mutation: rootMutation
        }
    `),
    rootValue: {
      events: async () => {
        try {
            const events = await Event.find();

            return events;
        } catch (error) {
            console.log(error);
        }
      },

      createEvent: async ({ eventInput }) => {
        try {
          const event = new Event({
            title: eventInput.title,
            description: eventInput.description,
            price: +eventInput.price,
            date: eventInput.date,
          });

          await event.save();
          return event;
        } catch (error) {
          console.log(error);
        }
      },
    },
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
