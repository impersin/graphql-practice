const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = graphql;

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
        // return _.find(authors, { id: parent.authorId });
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
        // return _.filter(books, { authorId: parent.id });
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
        // return _.find(books, { id: args.id });
      },
    },
    author: {
      type: AuthorType, // target object
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // ex) args is 'id' above
        // code to get data from db / other source
        // return _.find(authors, { id: args.id });
      },
    },
    // Create books query
    books: {
      type: GraphQLList(BookType), // Use GraphQLList for list
      resolve(parent, args) {
        // return books;
      },
    },

    authors: {
      type: GraphQLList(AuthorType), // Use GraphQLList for list
      resolve(parent, args) {
        // return authors;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
