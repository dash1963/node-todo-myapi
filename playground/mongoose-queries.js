const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var user_id = "59b22329be0cb9057e2d15b3";

      // var todo_id =  "59b2c97e7d1c143b52a2227b";
      //
      // if (!ObjectID.isValid(id)) {
      //   console.log('Id not valid');
      // };

      // Todo.find({
      //   _id: todo_id
      // }).then((todos) => {
      //   console.log('Todos: ', todos);
      // });
      //
      // Todo.findOne({
      //   _id: todo_id
      // }).then((todo) => {
      //   console.log('Todo: ', todo);
      // });

      // Todo.findById(todo_id).then((todo) => {
      //   if (!todo) {
      //     return console.log('Id not found!');
      //   }
      //   console.log('Todo by id: ', todo);
      // }).catch((error) => console.log(error));


User.findById(user_id).then((user) => {
  if (!user) {
    return console.log('Id not found!');
  }
  console.log(JSON.stringify(user, undefined, 2));
}).catch((error) => console.log(error));
