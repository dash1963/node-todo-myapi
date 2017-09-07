//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
  if (error) {
    return console.log('Uable to connect to MongoDb server');
  };
  console.log('Connected to MongoDb server')

  db.collection('Todos').find().toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 3));
  }, (error) => {
    console.log('Unable to fetch todos', error);
  });

  db.collection('Todos').find({completed:false}).toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 3));
  }, (error) => {
    console.log('Unable to fetch unfinished todos', error);
  });

  db.collection('Todos').find({
      _id: new ObjectID("59b0ee1b4409331ea3b00ddf")}).toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 3));
  }, (error) => {
    console.log('Unable to fetch todos', error);
  });


  db.collection('Todos').find().count().then((count) => {
    console.log(`Todos count: ${count}`);
  }, (error) => {
    console.log('Unable to fetch todos', error);
  });

  db.collection('Users').find({name:"Ana"}).toArray().then((docs) => {
    console.log('Users');
    console.log(JSON.stringify(docs, undefined, 3));
  }, (error) => {
    console.log('Unable to fetch User', error);
  });



  //db.close();
});
