//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
  if (error) {
    return console.log('Uable to connect to MongoDb server');
  };
  console.log('Connected to MongoDb server')

db.collection('Todos').findOneAndUpdate({
  _id: new ObjectID("59b158d94409331ea3b00e08")
}, {
     $set: {
      completed: false
     }
 },
   {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  db.collection('Users').findOneAndUpdate({
     name: 'Serge'
  }, {
       $set: {name: 'Serginho'}
     },
  {
      returnOriginal: false
  }).then((result) => {
      console.log(result);
    });

    db.collection('Users').findOneAndUpdate({
       name: 'Serginho'
    }, {
         $inc: {age: 1}
       },
    {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
      });

  //db.close();
});
