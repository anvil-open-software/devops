/*
 * run with yarn server name
 * node getSparkStreamingMetrics.js 10.x.x.x extractFromEventSummary \
    regression_test us-east-1 warn latest extractFromEventSummary -7 5
 *
 *
 * Currently outputs to console the event metrics from the spark server, but need to write back to server
 *
 */

var Client = require('node-rest-client').Client;
var timeUtils = require("./timeUtils");

var dynamoTableUtils = require("./dynamoDBUtils");
client = new Client();

var runDetails = [];

// use info
runDetails.loglevel='warn';

// hardcode dynamodb names now since they are baked into the toolkit code
runDetails.dynamoDB_stream_summary_table="perftest_kinesis_stream_summary";
runDetails.eventSummaryTableName="perftest_kinesis_event_summary";

runDetails.yarnMasterIP = process.argv[2];

//This default value will be replaced by what is in the summary table
runDetails.dynamodb_counts_region = process.argv[3];
runDetails.kinesisStream = process.argv[4];

runDetails.eventSummary_aws_region = process.argv[5];
runDetails.loglevel = process.argv[6];

runDetails.eventSummaryRangeKeyStartsWith = process.argv[7];

runDetails.startTime = process.argv[8];
if (runDetails.startTime!="extractFromEventSummary") {
    runDetails.endTime = process.argv[9];
} else {
    runDetails.timezoneOffset = process.argv[9];
    runDetails.waitMinutesForSparkToFinish = process.argv[10];
}


var yarn_base = "http://" + runDetails.yarnMasterIP + ":8088";
var yarn_app_url = yarn_base + "/ws/v1/cluster/apps";

var debug_log = false;

var http_args = {
    headers: {"Content-Type": "application/json"}
}

var results = [];
var appsCount = 0;


// polyfill here for jenkins server with does not recognize endsWith, must be a real old version of node
String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

// Make this independent so others requests can still be taken
var summaryResults = dynamoTableUtils.getEventRunSummary(runDetails, runDetails.eventSummaryTableName, function (summary) {
    if (runDetails.loglevel=='info') {
        console.log("Gathering Test Results with Initial Parameters");
       console.log(runDetails);
     }

    // use it later on
    runDetails.eventRecordedStartTime = null;
    runDetails.eventRecordedEndTime = null;
    if (summary === undefined) {
        console.log("Event summary row has not been found.");
    } else {
         if (runDetails.loglevel=='info') {
           console.log(summary);
        }

        console.log("------------------------");
        console.log("EVENT Generation Summary from Kinesis Client for " +runDetails.kinesisStream  );
        console.log();
        // if table entry does not have these fields because a test did not put them in, then we should exit gracefully.
        runDetails.eventSummary= [];
        var eventSummary = runDetails.eventSummary;

        try {
            runDetails.eventRecordedStartTime = new Date(Number(summary.runStartTimeInMillis.N));
            console.log("startLocalTime:" + runDetails.eventRecordedStartTime.toLocaleString());
            runDetails.eventRecordedEndTime = new Date(Number(summary.runEndTimeInMillis.N));
            console.log("endLocalTime:" + runDetails.eventRecordedEndTime.toLocaleString());

            eventSummary.totalEventsSucceeded= Number(summary.totalEventsSucceeded.N);
            console.log("totalEventsAttempted:" + eventSummary.totalEventsAttempted);

            console.log("totalKinesisErrors:" + summary.totalEventsFailedKinesisErrors.N);
            console.log("totalSystemErrors:" + summary.totalEventsFailedSystemErrors.N);
            // there was a rename so this could fail
            console.log("totalEventsFailed:" + summary.totalEventsFailed.N);

            var avgEventsPerSec= Math.round(1000*eventSummary.totalEventsSucceeded/
                (runDetails.eventRecordedEndTime.getTime()- runDetails.eventRecordedStartTime.getTime()))
            console.log("avg events/sec:" + avgEventsPerSec );
            console.log("totalEventsSucceeded:" + eventSummary.totalEventsSucceeded);

            if (runDetails.dynamodb_counts_region=="extractFromEventSummary") {
                // extract region
                var rawArgs = summary.rawJavaArgs.S;
                // get region [https://kinesis.us-east-1.amazonaws.com,
                var startof = rawArgs.indexOf("https://kinesis.");
                var region = rawArgs.substring(startof + 16, rawArgs.indexOf(".amazonaws.com"));
                runDetails.dynamodb_counts_region = region;
            }
            // set time
            if (runDetails.startTime=="extractFromEventSummary") {
                runDetails.startTime = timeUtils.convertISOToLocalTruncatedMinutes(
                            runDetails.eventRecordedStartTime.getTime(),runDetails.timezoneOffset);
                //todo add a buffer of a few minutes
                var sparkProcessingWaitTime = runDetails.waitMinutesForSparkToFinish*60*1000;
                var sparkProcessingEndTime = sparkProcessingWaitTime + runDetails.eventRecordedEndTime.getTime();
                runDetails.endTime=  timeUtils.convertISOToLocalTruncatedMinutes(
                    sparkProcessingEndTime,runDetails.timezoneOffset);
            }



        } catch (e) {
            console.log("Warning event generation row did not have all fields defined:" + e);
            console.log(summary);
        }
    }

// get event collector streaming count results

dynamoTableUtils.getEventRunSummary(runDetails, runDetails.dynamoDB_stream_summary_table, function (summary) {
    if (summary === undefined) {
        console.log("Kinesis Stream summary row has not been found.");
    } else {
        // console.log(summary);
        console.log("\n------------------------");
        console.log("Kinesis Stream Direct Count (Event Collector):: MUST MATCH " );
        console.log();
        // if table entry does not have these fields because a test did not put them in, then we should exit gracefully.
        runDetails.streamCountSummary= [];
        var streamSummary = runDetails.streamCountSummary;

        try {
            streamSummary.eventRecordedStartTime = new Date(Number(summary.runStartTimeInMillis.N));
            streamSummary.eventRecordedEndTime = new Date(Number(summary.runEndTimeInMillis.N));
            streamSummary.totalEventCount= Number(summary.totalEventCount.N);

            if (runDetails.dynamodb_counts_region=="extractFromEventSummary") {
                // extract region
                var rawArgs = summary.rawJavaArgs.S;
                // get region [https://kinesis.us-east-1.amazonaws.com,
                var startof = rawArgs.indexOf("https://kinesis.");
                var region = rawArgs.substring(startof + 16, rawArgs.indexOf(".amazonaws.com"));
                runDetails.dynamodb_counts_region = region;
            }
            // set time
            if (runDetails.startTime=="extractFromEventSummary") {
                streamSummary.startTime = timeUtils.convertISOToLocalTruncatedMinutes(
                            runDetails.eventRecordedStartTime.getTime(),runDetails.timezoneOffset);
                //todo add a buffer of a few minutes
                var sparkProcessingWaitTime = runDetails.waitMinutesForSparkToFinish*60*1000;
                var sparkProcessingEndTime = sparkProcessingWaitTime + runDetails.eventRecordedEndTime.getTime();
                streamSummary.endTime=  timeUtils.convertISOToLocalTruncatedMinutes(
                    sparkProcessingEndTime,runDetails.timezoneOffset);
            }
            console.log(streamSummary);


        } catch (e) {
            console.log("Warning event generation row did not have all fields defined:" + e);
            console.log(summary);
        }
    }



// get SPARK STREAMING METRIC from YARN apps
    client.get(yarn_app_url, http_args, function (data, response) {

        if (debug_log) {
            var dataString= JSON.stringify(data,null, 2); console.log(dataString);
        }

        //loop through all apps that are in RUNNING state
        for (var index in data.apps.app) {
            var application = data.apps.app[index];
            if (application.state == "RUNNING") {
                appsCount++;
                // console.log(application.id + ":" + application.state );
                // create url, i.e. http://yarn-master:8088/proxy/application_1442616130435_0005/metrics/json
                var metric_URL = yarn_base + "/proxy/" + application.id + "/metrics/json";
                if (debug_log) {
                    console.log("Requesting " + metric_URL);
                }
                client.get(metric_URL, http_args, function (data, response) {
                    data = JSON.parse(data);
                    // field name is something very complex and since we do not know yet the name of the LT, we do a scan...
                    //application_1442854352229_0001.driver.yarn3_Event_Aggregator_LT.StreamingMetrics.streaming.totalReceivedRecords
                    // note currently naming is yarn3_Event_Aggregator
                    var baseMetricFieldId = "";
                    for (var key in data.gauges) { //matches only once...
                        if (key.endsWith("StreamingMetrics.streaming.totalProcessedRecords")) {
                            baseMetricFieldId = key.substring(0, key.indexOf("Metrics.streaming.") + 18);
                            var dynamoTable = key.substring(key.indexOf("driver.") + 7, key.indexOf("_Event_Aggregator") + 17);
                            results[dynamoTable] = [];
                            results[dynamoTable].sparkStats = [];
                            var sparkStats = results[dynamoTable].sparkStats;
                            sparkStats.totalProcessedRecords = data.gauges[key].value;
                        }
                    }

                    // some other stats which might prove useful
                    sparkStats.startTimeMillis = new Date(application.startedTime).toLocaleString();
                    // sparkStats.startTimeMillis = application.startedTime;
                    // metric url a different value by this time.. not in data and http get needs anonymous function so we just redo
                    sparkStats.url = yarn_base + "/proxy/" + application.id + "/metrics/json"
                    sparkStats.url_streaming = yarn_base + "/proxy/" + application.id + "/streaming"
                    sparkStats.totalReceivedRecords = data.gauges[baseMetricFieldId + "totalReceivedRecords"].value;
                    sparkStats.totalCompletedBatches = data.gauges[baseMetricFieldId + "totalCompletedBatches"].value;
                    sparkStats.runningBatches = data.gauges[baseMetricFieldId + "runningBatches"].value;

                    // console.log("Getting aggregate counts from " + dynamoTable + ".");
                    //console.log(sparkStats);
                    // get DYNAMODB COUNTS with the dynamoDB table names scraped from YARN/Spark


                    var ddbResults = dynamoTableUtils.getDynamoDBSum(dynamoTable, runDetails,
                        function (ddbResults) { //todo cleanup with promises later
                            console.log("\n\n------------------------");
                            console.log("DynamoDB Aggregate Counts from dynamoTable:: MUST MATCH");
                            console.log(ddbResults);
                             console.log("\n\n------------------------");
                            console.log("Spark Streaming Stats");
                            console.log(results[dynamoTable]);

                            console.log("\n\n------------------------------------------------------------------ ");
                            console.log("FINAL RESULTS for Kinesis Stream " +runDetails.kinesisStream );
                            console.log("------------------------------------------------------------------ ");
                            var streamCountTotal = runDetails.streamCountSummary.totalEventCount;
                            if (ddbResults.dynamoDBTotal != streamCountTotal) {
                                 var diff = ddbResults.dynamoDBTotal - streamCountTotal;
                                 console.log("\nERROR - DYNAMODB counts DO NOT MATCH Stream Count "
                                     + ddbResults.dynamoDBTotal + "!=" + streamCountTotal +  " DDB off by " + diff)
                             } else {
                                console.log("SUCCESS- DynamoDB aggregate counts match the Kinesis Stream Count "
                                    +streamCountTotal);
                             }

                            var sparkMetrics = results[dynamoTable].sparkStats;
                            // diff with total processed records, this may change when duplicates are handled
                            if (ddbResults.dynamoDBTotal != sparkMetrics.totalProcessedRecords) {
                                var diff = ddbResults.dynamoDBTotal - sparkMetrics.totalProcessedRecords;
                                console.log("INFO - DYNAMODB counts may not necessarily match Spark Streaming "
                                    + ddbResults.dynamoDBTotal + "!=" + sparkMetrics.totalProcessedRecords +
                                    " OFF by " + diff)
                            } else {
                                console.log("SUCCESS- Spark Streaming total events processed match the Kinesis Stream Count "
                                       + sparkMetrics.totalProcessedRecords);
                            }

                            var eventClientTotal = runDetails.eventSummary.totalEventsSucceeded;
                            if (ddbResults.dynamoDBTotal != runDetails.eventSummary.totalEventsSucceeded) {
                                var diff = ddbResults.dynamoDBTotal - eventClientTotal;
                                console.log("INFO - DYNAMODB counts will rarely match Event Client due to submit errors "
                                    + ddbResults.dynamoDBTotal + "!=" + eventClientTotal +
                                    " DDB off by " + diff)
                            }
                          console.log("\n Please note only final DYNAMODB aggregate count will be expected to match the direct stream count!");



                        });

                }).on('error', function (err) {
                    console.log('Getting metric request Failed:', err.request.options);
                });
            }
        }

    }).on('error', function (err) {
        console.log('Request Failed:', err.request.options);
    });

});

  });






