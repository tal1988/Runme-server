var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var md5 = require('MD5');

//User schema
var userSchema = mongoose.Schema
({
    name: String,
    avatar: String,
    avatar_rotate: Number,
    username: String,
    password: String,
    email: String
});

//Method that encode the user password.
userSchema.methods.generateHash = function(password)
{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//Method that check if the password that the user gave is valid.
userSchema.methods.validPassword = function(password)
{
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);