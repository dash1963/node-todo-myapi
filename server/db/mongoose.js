var moment = require('moment');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);


module.exports = {
  mongoose: mongoose,
  moment: moment
}
