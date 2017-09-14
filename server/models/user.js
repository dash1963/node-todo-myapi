
const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');



var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [ {
    access: {
      type: String,
      Required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
  });

UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);

}
// instance methods
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token  = jwt.sign({_id: user._id.toHexString(), access},'abc123').toString();

  user.tokens.push({ access, token });
  return user.save().then (() => {
    return token
  });
};


var User = mongoose.model('User',UserSchema);

module.exports = {User}
