const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { ApolloServer } = require('apollo-server-express');



const dotenv = require('dotenv');
dotenv.config();


const mongodb_atlas_url = process.env.MONGODB_URL;
console.log(mongodb_atlas_url);

const connectDB = async() => {
    try{
      mongoose.connect(mongodb_atlas_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(success => {
        console.log('Success Mongodb connection')
      }).catch(err => {
        console.log("Error: "+ err)
        console.log('Error Mongodb connection')
      });
    } catch(error) {
        console.log(`Unable to connect to DB : ${error.message}`);
      }
  }

const server = new ApolloServer({ typeDefs, resolvers });


//Define Express Server
const app = express();
app.use(express.json());
app.use('*', cors());



async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
  
  app.listen({ port: process.env.PORT || 4000 }, async () => {
      await connectDB();
      console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 4000}${server.graphqlPath}`);
  });
}
startServer();
