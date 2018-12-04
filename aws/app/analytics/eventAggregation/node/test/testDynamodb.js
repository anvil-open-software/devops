var Client = require('node-rest-client').Client;
var dynamoTableUtils = require("../dynamoDBUtils");

var runDetails = [];

runDetails.eventSummaryRangeKeyStartsWith ="2015-09-24T14";
// runDetails.eventSummaryRangeKeyStartsWith = "latest";
 //runDetails.kinesisStream="yarn-test";
runDetails.kinesisStream="yarn_spark15_perf";
runDetails.eventSummary_aws_region ="us-east-1"
runDetails.eventSummaryTableName="perftest_kinesis_event_summary";

dynamoTableUtils.getEventRunSummary(runDetails, function (summary) {
   console.log(summary);
});