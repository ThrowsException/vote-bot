import feathers from '@feathersjs/feathers';
import { MongoClient } from 'mongodb';
import service from 'feathers-mongodb';
import express from '@feathersjs/express';

const app = express(feathers());

// Express middleware to parse HTTP JSON bodies
app.use(express.json());
// Express middleware to parse URL-encoded params
app.use(express.urlencoded({ extended: true }));
// Express middleware to to host static files from the current folder
app.use(express.static(__dirname));
// Add REST API support
app.configure(express.rest());
// Express middleware with a nicer error handler
app.use(express.errorHandler());

MongoClient.connect('mongodb://localhost:27017').then(client => {
  app.use(
    '/messages',
    service({
      Model: client.db('myproject').collection('results'),
    })
  );
});

app.listen(3000);
