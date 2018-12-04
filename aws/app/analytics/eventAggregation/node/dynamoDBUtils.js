/*
 Dynamo DB Utility functions 

 */

var AWS = require('aws-sdk');

module.exports = {

    /*
     sum all counts in runDetails.tableName between time period runDetails.startTime and runDetails.endTime

     time format 2015-09-21T08:09
     */
    getDynamoDBSumForTimePeriod: function (tableName, runDetails, callback) {
        var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10', region: runDetails.dynamodb_counts_region});
        //console.log(runDetails);

        var greaterthan = runDetails.startTime;
        var lessthan = runDetails.endTime;

        var params = {

            TableName: tableName,
            ConsistentRead: true,
            // since bucket and count are reserved words, we have to substitute with #
            // we are also forced to do a filter scan since KeyConditionExpression, hash only allows equals
            FilterExpression: "#bucket_field BETWEEN :run_start_date and :run_end_date ",
            ProjectionExpression: "#count_field",
            ExpressionAttributeNames: {
                '#bucket_field': 'bucket',
                '#count_field': 'count'
            },
            ExpressionAttributeValues: {
                ':run_start_date': {'S': greaterthan},
                ':run_end_date': {'S': lessthan},
            }
        };
        console.log("FILTERING by " + greaterthan + " and " + lessthan );
        var results = [];
        dynamodb.scan(params, function (err, data) {
            var total_count = 0;
            if (err) {
                console.log("ERROR No Aggregate Count ROWS found from " + tableName);
                // console.log(err, err.stack);
                return err;
            }
            if (runDetails.loglevel=='info') {
                console.log(JSON.stringify(data, null, 2));
             }
            for (var index in data.Items) {
                total_count = total_count + Number(data.Items[index].count.N);
            }
            results.tableName = tableName;
            results.dynamoDBTotal = total_count;
            results.dynamoDBRows = data.Count;
            if (runDetails.loglevel=='info') {
                console.log(results);
            }

            return callback(results);
        });
    },

     getDynamoDBSum: function (tableName, runDetails, callback) {
            var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10', region: runDetails.dynamodb_counts_region});
            //console.log(runDetails);


            var params = {

                TableName: tableName,
                ConsistentRead: true
            };

            var results = [];
            dynamodb.scan(params, function (err, data) {
                var total_count = 0;
                if (err) {
                    console.log("ERROR No Aggregate Count ROWS found from " + tableName);
                    console.log(err, err.stack);
                    return err;
                }
                if (runDetails.loglevel=='info') {
                console.log(JSON.stringify(data, null, 2));
 }
                for (var index in data.Items) {
                    total_count = total_count + Number(data.Items[index].count.N);
                }
                results.tableName = tableName;
                results.dynamoDBTotal = total_count;
                results.dynamoDBRows = data.Count;

                //console.log(results);
                return callback(results);
            });
        },

    getEventRunSummary: function (runDetails, tableName,  callback) {
        var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10', region: runDetails.eventSummary_aws_region});
        //console.log(runDetails);
        // var tableName = runDetails.eventSummaryTableName;
        var startswith = runDetails.eventSummaryRangeKeyStartsWith;
        var kinesisStream = runDetails.kinesisStream;
        var params;
        if (runDetails.eventSummaryRangeKeyStartsWith=="latest") {
             params = {
                TableName: tableName,
                ConsistentRead: true,
                KeyConditionExpression: "kinesisStream = :hashval",
                Limit: 1,
                 ScanIndexForward: false,
                ExpressionAttributeValues: {  ':hashval': {'S': kinesisStream}   }
            };
        }  else  params = {
            TableName: tableName,
            ConsistentRead: true,
            // since bucket and count are reserved words, we have to substitute with #
            // we are also forced to do a filter scan since KeyConditionExpression, hash only allows equals
            KeyConditionExpression: "kinesisStream = :hashval AND begins_with(runStartTime, :rangeval ) ",
            //ProjectionExpression: "#count_field",
            ExpressionAttributeValues: {
                ':hashval': {'S': kinesisStream},
                ':rangeval': {'S': startswith},
            }
        };



        var results = [];
        dynamodb.query(params, function (err, data) {
            var total_count = 0;
            // console.log("DYNAMODB returned:" + JSON.stringify(data, null, 2));
            if (err) {
                console.log("ERROR Trying to Query SUMMARY ROW ");
                console.log(err, err.stack);
                return 0;
            }
            // todo error out if not exactly one has been called...
            //console.log(JSON.stringify(data, null, 2));
            try {
                if (data.Count > 1) {
                    console.log("ERROR, more than one summary returned: " + data.Items);
                }
            }
            catch (e) {
                console.log("WARNING: Query SUMMARY ROW not found");
                return e;
            }

            return callback(data.Items[0]);
        });
    }

}
