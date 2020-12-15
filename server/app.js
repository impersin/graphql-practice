const express = require('express');
// Import GraphQL module.
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

// route to use graphql and need to creat schema
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
  })
);

app.listen(4000, () => {
  console.log('Listening on port 4000');
});
