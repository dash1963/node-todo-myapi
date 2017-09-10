var moment = require('moment');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');
// moongose.connect('mongodb://srueda:srueda@ds129394.mlab.com:29394/enigmatic-cove-43037')

module.exports = {
  mongoose: mongoose,
  moment: moment
}
