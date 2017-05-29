var mongoose = require('mongoose');
var ONE_MINUTE = 60;
var ONE_HOUR = 60;

var dataSchema = mongoose.Schema
({
    username:String,
    total_time: String,
    total_km: String,
    routs: [JSON]
},
{ collection: 'users_data' });


dataSchema.methods.calcTotalTime = function(runningTime,totalTime)
{
    var timeAsString = "";
    var totalTimeSplit = totalTime.split(":");
    var totalTimeSec = totalTimeSplit[2].replace(/\s/g,'');
    var runningTimeSplit = runningTime.split(":");
    var runningTimeSec = runningTimeSplit[2].replace(/\s/g,'');

    var totalHours = (methods.convertStringToInt(totalTimeSplit[0])) + (methods.convertStringToInt(runningTimeSplit[0]));
    var totalMin = (methods.convertStringToInt(totalTimeSplit[1])) + (methods.convertStringToInt(runningTimeSplit[1]));
    var totalSec = (methods.convertStringToInt(totalTimeSec)) + (methods.convertStringToInt(runningTimeSec));

    while (totalSec >= ONE_MINUTE)
    {
        totalMin++;
        totalSec -= ONE_MINUTE;
    }

    while(totalMin >= ONE_HOUR)
    {
        totalHours++;
        totalMin -= ONE_HOUR;
    }

    if((totalHours/10) == 0)
        timeAsString = "0"+totalHours+":";
    else
        timeAsString = totalHours+":";

    if((totalMin/10) == 0)
        timeAsString += "0"+totalMin+":";
    else
        timeAsString += totalMin +":";

    if((totalSec/10) == 0)
        timeAsString += "0"+totalSec;
    else
        timeAsString += totalSec+"";

    return timeAsString;
};

dataSchema.method.calcTotalKM = function (totalKM,runningKM)
{
    return (String)(parseFloat(totalKM.replace(/\s/g,'')) + parseFloat(runningKM.replace(/\s/g,''))) +"";
};

dataSchema.method.calcAvgSpeed = function (runningTime,runningDistance)
{
    var dist = parseFloat(runningDistance.replace(/\s/g,''));
    var time = runningTime.split(":");
    var hours = time[0];
    return (String) (dist/hours);
};

dataSchema.methods.convertStringToInt = function (number)
{
    return parseInt(number);
};

module.exports = mongoose.model('Data', dataSchema);