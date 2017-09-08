var express    = require('express');
var bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');

var {moment}   = require('./db/mongoose');
var {mongoose} = require('./db/mongoose');

var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

// To create a todo record
app.post('/todos', (req, res) => {
   var todo = new Todo({
     text: req.body.text
   });

   todo.save().then((doc) => {
     res.send(doc);
   }, (error) => {
     res.status(400).send(error);
   });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
      res.send({todos});
  }, (error) => {
    res.status(400).send(error);
  });
});

// GET /todos/123456

app.get('/todos/:id', (req, res) => {
  var id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid Id');
  };

  Todo.findById(id).then((todo) => {
      if (!todo)
      { return res.status(404).send('Id Not Found!');}

      res.send({todo});
  }).catch((error) => {
     res.status(400).send();
  });

});





app.listen(3000, () => {
  console.log('Started on port 3000.');
});

module.exports = {app};
