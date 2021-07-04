const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const fetch = require('node-fetch');
 
// Construct a schema, using GraphQL schema language
const typeDefs =gql`
type Query {
  getPerson:[Person]
}

type Person {
  name: String
  height: String
  mass: String
  gender: String
  homeworld: String
}
`;
 
// The root provides a resolver function for each API endpoint
const resolvers = {
  Query :{
    getPerson: async () => {
      const res= await fetch(`https://swapi.dev/api/people/`)
      const data= res.json();
      return data.results;
    }
  }
  
}
 
const server = new ApolloServer({ typeDefs, resolvers });
server.start();

const app = express();
server.applyMiddleware({ app });

app.listen({port:4000});



/*




*/