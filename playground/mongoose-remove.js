const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });
//
// Todo.findOneAndRemove({})
//


User.findOneAndRemove( { _id : "59b88aca4409331ea3b00eb1"}).then ( (error, todo) => {

  console.log('Error: ', error);
  console.log("findOneAndRemove: Todo successfully deleted: ", todo);
});

Todo.findByIdAndRemove('59b88aca4409331ea3b00eb1').then ( (error, todo) => {

  console.log('Error: ', error);
  console.log("Todo successfully deleted: ", todo);
});
