var express    = require('express');
var bodyParser = require('body-parser');

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

module.exports = {app};




app.listen(3000, () => {
  console.log('Started on port 3000.');
})
