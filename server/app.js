const express = require('express');
// Import GraphQL module.
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(
  'mongodb+srv://Terry:Veeh012491ct@cluster0.sditq.mongodb.net/gql-ninja',
  { useNewUrlParser: true }
);

mongoose.connection.once('open', () => {
  console.log('connected to database');
});

// route to use graphql and need to creat schema
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    // To use GUI
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log('Listening on port 4000');
});
