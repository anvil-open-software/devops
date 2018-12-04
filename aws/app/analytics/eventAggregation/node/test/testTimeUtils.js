var timeUtils = require("../timeUtils");

var timeInMillis = 1443115765831;
console.log(new Date(timeInMillis));
var newDate = timeUtils.convertISOToLocalTruncatedMinutes(timeInMillis,-7);
console.log(newDate);
if (newDate!="2015-09-24T10:29") {
    throw new Error('Time did not match: ' + newDate);
}

