var User = require('../models/user');
var Data = require('../models/data');
var passport = require('passport');
var DEFAULT_TOTAL_TIME = "00:00:00";
var DEFAULT_TOTAL_KM = "0";

module.exports = {};

//Method that is using to create new user.
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
            newUser.avatar = req.body.avatar;
            newUser.avatar_rotate = req.body.avatar_rotate;

            newUser.save();

            res.writeHead(200, {"Content-Type": "application/json"});

            newUser = newUser.toObject();
            delete newUser.password;
            res.end(JSON.stringify(newUser));
        }
    });
};

//Method that save user data to the data base.
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
                   var speed = data.calcAvgSpeed(req.body.runningTime,req.body.runningKM);
                   var route = {route:req.body.route, route_running_time:req.body.runningTime,route_running_km:req.body.runningKM,
                                 route_actual_dist:req.body.routeDist,running_avg_speed:speed,date:req.body.timeAndDate};
                   data.routs.push(route);

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

//Method that get user data from the data base.
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
      else if(!data)
      {
          var newData = new Data();
          newData.username = req.body.username;
          newData.total_time = DEFAULT_TOTAL_TIME;
          newData.total_km = DEFAULT_TOTAL_KM;

          newData.save();

          res.writeHead(200, {"Content-Type": "application/json"});

          newData = newData.toObject();
          res.end(JSON.stringify(newData));
      }
    });
};

//Method that search for a specific user name in the data base.
module.exports.searchByUsername = function(req, res) {
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

//Method that do authenticate after login request by the user.
module.exports.login = function(req, res, next)
{
    passport.authenticate('local', function(err, user, info)
    {
        if (err)
            return next(err);
        if(!user)
            return res.status(400).json({SERVER_RESPONSE: 0, SERVER_MESSAGE: "Wrong Credentials"});
        req.logIn(user, function(err)
        {
            if (err)
                return next(err);
            if (!err)
                return res.json({ SERVER_RESPONSE: 1, SERVER_MESSAGE: "Logged in!" });

        });
    })(req, res, next);
};

//Method that update the user data in the data base.
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
                user.avatar = req.body.avatar ? req.body.avatar : user.avatar;
                user.username = req.body.username ? req.body.username : user.username;
                user.avatar_rotate = req.body.avatar_rotate ? req.body.avatar_rotate : user.avatar_rotate;
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
