//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
  if (error) {
    return console.log('Uable to connect to MongoDb server');
  };
  console.log('Connected to MongoDb server')

  // delete many  = deleteMany
     db.collection('Todos').deleteMany({text: 'Something to do'})
       .then((result) => {
       console.log(result);
     });

  // delete one   = deleteOne
  db.collection('Todos').deleteOne({text: 'Feed the dog'})
    .then((result) => {
    console.log(result);
  });


  // find one and delete  = dindOneAndDelete
  db.collection('Todos').findOneAndDelete({completed: false})
    .then((docs) => {
    console.log(docs);
  });



  db.collection('Users').deleteMany({name: 'Zoey'})
    .then((result) => {
    console.log(result);
  });


// find one and delete  = dindOneAndDelete
db.collection('Users').findOneAndDelete({_id: new ObjectID("59b0e46f3b3eda4ffc24be21")})
  .then((docs) => {
  console.log(docs);
});



  //db.close();
});
