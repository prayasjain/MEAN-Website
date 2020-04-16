const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true}, // unique is not a validator, for performance
  password: {type: String, required: true}
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);// collection name is Users
