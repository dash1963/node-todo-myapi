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
var {authenticate} = require('./middleware/authenticate');

var app = express();

var port = process.env.PORT ;



app.use(bodyParser.json());

// To create a todo record
app.post('/todos', authenticate, (req, res) => {
   var todo = new Todo({
     text: req.body.text,
     _creator: req.user._id
   });

   todo.save().then((doc) => {
     res.send(doc);
   }, (error) => {
     res.status(400).send(error);
   });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({_creator: req.user._id}).then((todos) => {
      res.send({todos});
  }, (error) => {
    res.status(400).send(error);
  });
});

app.get('/cool', function(request, response) {
  response.send(cool());
});


// GET /todos/123456

app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid Id');
  };
   console.log(`0: The id is ${id}`);
  Todo.findOne({
       _id: id,
  _creator: req.user._id
  }).then((todo) => {
      if (!todo)
      { return res.status(404).send('Id Not Found!');}

      res.send({todo});
  }).catch((error) => {
     res.status(400).send();
  });

});


app.delete('/todos/:id', authenticate, (req,res) => {
  var id =  req.params.id ;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
   console.log(`1: The id is ${id}`);
   Todo.findOneAndRemove({
          _id: id,
     _creator: req.user.id
   }).then((todo) => {
     if (!todo) {
       return res.status(404).send();
     }
     res.send({todo});
   }).catch ((e) => {
     res.status(400).send();
   });
})

app.patch('/todos/:id', authenticate, (req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
     body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
            _id: id,
       _creator: req.user.id
  }, {$set: body}, {new: true}).then((todo) => {
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


app.get('/users/me',authenticate, (req, res) => {
   res.send(req.user)
});

// LOGIN route
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
    res.header('x-auth', token).send(user);
    })
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send(req.token);
  }, () => {
    res.status(400).send();
  });
});



app.listen(port, () => {
  console.log(`started up at port ${port}`);
});

module.exports = {app};
