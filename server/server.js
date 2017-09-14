require('./config/config.js');
const _ = require('lodash');
const express    = require('express');
const bodyParser = require('body-parser');
const cool = require('cool-ascii-faces');


const {ObjectID} = require('mongodb');

var {moment}   = require('./db/mongoose');
var {mongoose} = require('./db/mongoose');

var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

var port = process.env.PORT ;



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

app.get('/cool', function(request, response) {
  response.send(cool());
});


// GET /todos/123456

app.get('/todos/:id', (req, res) => {
  var id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid Id');
  };
   console.log(`0: The id is ${id}`);
  Todo.findById(id).then((todo) => {
      if (!todo)
      { return res.status(404).send('Id Not Found!');}

      res.send({todo});
  }).catch((error) => {
     res.status(400).send();
  });

});


app.delete('/todos/:id', (req,res) => {
  var id =  req.params.id ;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
   console.log(`1: The id is ${id}`);
   Todo.findByIdAndRemove(id).then((todo) => {
     if (!todo) {
       return res.status(404).send();
     }
     res.send({todo});
   }).catch ((e) => {
     res.status(400).send();
   });
})

app.patch('/todos/:id', (req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  console.log(`2: The id is ${id}`);
  if (_.isBoolean(body.completed) && body.completed) {
     body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  console.log(`2a: The id is ${id}`);
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// To create a USER record
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  // body.email    = 'sergio4234@gmail.com';
  // body.password = 'abc12';

  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((error) => {
     res.status(400).send(error);
   });
});

//  To get all USERS
app.get('/users', (req, res) => {
  User.find().then((users) => {
      res.send({users});
  }).catch((error) => {
    res.status(400).send(error);
  });
});



app.listen(port, () => {
  console.log(`started up at port ${port}`);
});

module.exports = {app};
