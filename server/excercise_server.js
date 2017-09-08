const moment = require('moment');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

var User = mongoose.model('User', {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
    }
});


var newTodo = new Todo({
  text: 'Eat lunch',
  completed: false,
  completedAt: parseInt(moment(new Date()).format('YYYYMMDDHHMMSS'))
});

newTodo.save().then((doc) => {
  console.log('Saved todo: ', JSON.stringify(doc, undefined, 2));
}, (error) => {
  console.log('Unable to save todo', error);
});


var newUser = new User({
    email: 'sergio4234@msn.com'
});

newUser.save().then((doc) => {
  console.log('Saved user: ', JSON.stringify(doc, undefined, 2));
}, (error) => {
  console.log('Unable to save user', error);
});
