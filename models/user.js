var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var md5 = require('MD5');

var userSchema = mongoose.Schema
({
    name: String,
    avatar: String,
    avatar_path:String,
    username: String,
    password: String,
    email: String
});

userSchema.methods.generateHash = function(password)
{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password)
{
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);