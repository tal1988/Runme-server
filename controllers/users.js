var User = require('../models/user');
var Data = require('../models/data');
var passport = require('passport');
var DEFAULT_TOTAL_TIME = "00:00:00";
var DEFAULT_TOTAL_KM = "0";

module.exports = {};

module.exports.create = function(req, res)
{
    if (!req.body.name || !req.body.username || !req.body.password || !req.body.email)
        return res.status(400).end('Invalid input');

    User.findOne({ username:  req.body.username }, function(err, user)
    {
        if (user)
        {
            return res.status(400).end('User already exists');
        }
        else
        {
            var newUser = new User();
            newUser.name = req.body.name;
            newUser.username = req.body.username;
            newUser.password = newUser.generateHash(req.body.password);
            newUser.email = req.body.email;
            newUser.desc = req.body.desc;

            newUser.save();

            res.writeHead(200, {"Content-Type": "application/json"});

            newUser = newUser.toObject();
            delete newUser.password;
            res.end(JSON.stringify(newUser));
        }
    });
};

module.exports.savedata = function (req, res)
{
    User.findOne({username:req.body.username},function (err,user)
    {
        if(user)
        {
            Data.findOne({username:req.body.username},function (err,data)
            {
               if(data)
               {
                   var time = data.calcTotalTime(req.body.runningTime,data.total_time);
                   var km = data.calcTotalKM(req.body.runningKM,data.total_km);
                   var route = {route:req.body.route, route_time:req.body.route_time,route_km:req.body.route_km};
                   data.routs.push(route);

                   user.name = req.body.name ? req.body.name : user.name;
                   data.total_time = time ? time : user.total_time;
                   data.total_km = km ? km : user.total_km;
                   data.routs = data.routs ? data.routs : data.routs;

                   data.save();

                   res.writeHead(200, {"Content-Type": "application/json"});
                   data = data.toObject();
                   res.end(JSON.stringify(data));
               }
               if(err)
               {
                   return res.status(400).end("Some thing went wrong,Try Again Later");
               }
            });
        }
        else
        {
            return res.status(400).end('Failed To Save Data');
        }
    });
};

module.exports.getdata = function (req, res)
{
    Data.findOne({username:req.body.username},function (err,data)
    {
      if(data)
      {
          res.writeHead(200, {"Content-Type": "application/json"});

          data = data.toObject();
          res.end(JSON.stringify(data));
      }
      else
      {
          var newData = new Data();
          newData.username = req.body.username;
          newData.time = DEFAULT_TOTAL_TIME;
          newData.km = DEFAULT_TOTAL_TIME;

          newData.save();

          res.writeHead(200, {"Content-Type": "application/json"});

          newData = newData.toObject();
          res.end(JSON.stringify(newData));
      }
    });
};

module.exports.login = function(req, res, next)
{
    passport.authenticate('local', function(err, user, info)
    {
        if (err)
            return next(err);
        if(!user)
            return res.status(400).json({SERVER_RESPONSE: 0, SERVER_MESSAGE: "Wrong Credentials"});
        req.logIn(user, function(err) {
            if (err)
                return next(err);
            if (!err)
                return res.json({ SERVER_RESPONSE: 1, SERVER_MESSAGE: "Logged in!" });

        });
    })(req, res, next);
};

module.exports.read = function(req, res)
{
    User.findById(req.params.id, function(err, user)
    {
        if (user)
        {
            res.writeHead(200, {"Content-Type": "application/json"});
            user = user.toObject();
            delete user.password;
            delete user.__v;
            res.end(JSON.stringify(user));
        }
        else
        {
            return res.status(400).end('User not found');
        }
    });
};


module.exports.readByUsername = function(req, res)
{
    User.findOne({ username: req.params.username }, function(err, user)
    {
        if (user)
        {
            res.writeHead(200, {"Content-Type": "application/json"});
            user = user.toObject();
            delete user.password;
            delete user.__v;
            res.end(JSON.stringify(user));
        }
        else
        {
            return res.status(400).end('User not found');
        }
    });
};

module.exports.me = function(req, res)
{
    User.findOne({ username: req.user.username }, function(err, user)
    {
        if (user)
        {
            res.writeHead(200, {"Content-Type": "application/json"});
            user = user.toObject();
            delete user.password;
            delete user.__v;
            res.end(JSON.stringify(user));
        }
        else
        {
            return res.status(400).end('User not found');
        }
    });

};


module.exports.update = function(req, res)
{
    User.findById(req.user.id, function(err, user)
    {
        if (user)
        {
            if (user.username != req.user.username) {
                return res.status(401).end('Modifying other user');
            }
            else
            {
                user.name = req.body.name ? req.body.name : user.name;
                //user.desc = req.body.dec ? req.body.desc : user.desc;
                user.username = req.body.username ? req.body.username : user.username;
                //user.password = req.body.password ? user.generateHash(req.body.password) : user.password;
                user.email = req.body.email ? req.body.email : user.email;
                user.save();

                res.writeHead(200, {"Content-Type": "application/json"});
                user = user.toObject();
                delete user.password;
                res.end(JSON.stringify(user));
            }
        }
        else
        {
            return res.status(400).end('User not found');
        }
    });
};

module.exports.delete = function(req, res)
{
    User.remove({_id: req.user.id}, function(err)
    {
        res.end('Deleted')
    });
};