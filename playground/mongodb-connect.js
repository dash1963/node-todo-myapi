//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

//example of using deconstruicting
// var obj = new ObjectID();
// console.log(obj);
// example ends

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
  if (error) {
    return console.log('Uable to connect to MongoDb server');
  };
  console.log('Connected to MongoDb server')

  // db.collection('Todos').insertOne({
  //
  // }, (error, result) => {
  //   if(error) {
  //     return console.log('Unable to insert Todo', error);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // })

  // db.collection('Users').insertOne({
  //    name:"Zoey",
  //    age:43,
  //    location:"Melrose Park"
  // }, (error, result) => {
  //   if (error) {
  //      return console.log('Unable to insert User', error);
  //   }
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 3));
  // });



  db.close();
});
