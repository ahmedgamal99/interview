const Joi = require('joi')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },

  email: {
    type: String,
    required: true,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  }, 

  dob:{
    type: Date,
    required: true
  }, 

  nationality: {
    type: String, 
    required: true
  }, 

  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'))
}

const User = mongoose.model('User', userSchema);



const cutoffDate = new Date(Date.now() - (1000 * 60 * 60 * 24 * 365 * 19));

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().max(255).required().email(),
    password: Joi.string().alphanum().min(8).max(255).required(),
    isAdmin: Joi.boolean(), 
    nationality: Joi.string().max(50),

    dob: Joi.date().max(cutoffDate).required().error((errors)=>{
      return errors.map(error => {
          switch(error.type){
              case "date.max":
                  return {message : "You must be above 18"}
          }
      })
  })
  };

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;