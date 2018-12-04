module.exports = {

    /*
       Return date string with has offset calculated from UTC,
       i.e. Thu Sep 24 2015 10:29:25 GMT-0700 (PDT)
         with offset -7 would give
              2015-09-24T10:29
     */
    convertISOToLocalTruncatedMinutes: function (dateInMillis, hourOffset) {

        function pad(number) {
            if (number < 10) {
                return '0' + number;
            }
            return number;
        }

        //console.log("Date: " + new Date(dateInMillis).toISOString());
        var shiftedDateMillis = dateInMillis + (hourOffset * 60 * 60 * 1000);
        var shiftedDate = new Date(shiftedDateMillis);

        return shiftedDate.getUTCFullYear() +
            '-' + pad(shiftedDate.getUTCMonth() + 1) +
            '-' + pad(shiftedDate.getUTCDate()) +
            'T' + pad(shiftedDate.getUTCHours()) +
            ':' + pad(shiftedDate.getUTCMinutes());

    }


}