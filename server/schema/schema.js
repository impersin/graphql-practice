const graphql = require('graphql');
const _ = require('lodash');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = graphql;

// dummy data
var books = [
  { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
  { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
  { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '2' },
  { name: 'The Long Earth', genre: 'Sci-Fi', id: '4', authorId: '3' },
  { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
  { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' },
];

var authors = [
  { name: 'Patrick Rothfuss', age: 44, id: '1' },
  { name: 'Brandon Sanderson', age: 42, id: '2' },
  { name: 'Terry Pratchett', age: 66, id: '3' },
];

// Reason why "fields" is method, Javascript doesn't know what the related type is
// when the code is running. by the time we run the field methods all the types will be
// declared.

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        console.log(parent);
        return _.find(authors, { id: parent.authorId });
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      // This can't be BookType which is only for single value not list.
      type: new GraphQLList(BookType),
      resolve(parent, arg) {
        return _.filter(books, { authorId: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // book => query name ex) book {}
    book: {
      type: BookType, // target object
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // ex) args is 'id' above
        // code to get data from db / other source
        return _.find(books, { id: args.id });
      },
    },
    author: {
      type: AuthorType, // target object
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // ex) args is 'id' above
        // code to get data from db / other source
        return _.find(authors, { id: args.id });
      },
    },
    // Create books query
    books: {
      type: GraphQLList(BookType), // Use GraphQLList for list
      resolve(parent, args) {
        return books;
      },
    },

    authors: {
      type: GraphQLList(AuthorType), // Use GraphQLList for list
      resolve(parent, args) {
        return authors;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
