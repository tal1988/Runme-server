var users  = require('./controllers/users');
var express = require('express');
var User = require('./models/user');

module.exports = function(app, passport)
{
    app.get('/', function(req, res) {
        res.end("MobilePassport API v1");
    });


    // Login [x]
    app.post('/login', users.login);

    // Register [x]
    app.post('/register', users.create);

    // Save User Data
    app.post('/user/save',users.savedata);

    // Get User Data
    app.post('/user/getdata',users.getdata);

    // Search for user by username
    app.get('/user/search/username/:username', users.searchByUsername);

    // Update as currently logged in user
    app.post('/user/update', isLoggedIn, users.update);


    // Method that execute when the user is want to log out.
    app.post('/logout', function(req, res) {
        req.logout();
        res.end('Logged out')
    });
};

//Method that checks if the user is logged in.
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.end('Not logged in');
}