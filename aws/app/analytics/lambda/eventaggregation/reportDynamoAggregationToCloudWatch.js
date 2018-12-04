
console.log('Loading function');
var AWS = require('aws-sdk'); 
var cloudwatch = new AWS.CloudWatch();
var cw_namespace = "DL_SPARK_EVENTS";
var cw_metric_suffix= "_EVENTS_PER_MINUTE_RUN1";

exports.handler = function(event, context) {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    
    event.Records.forEach(function(record) { 
        console.log(record.eventID);
        console.log(record.eventName);
        var dbARN = record.eventSourceARN; 
        
        var prefix_begin=dbARN.indexOf("table");
        var prefix_end=dbARN.indexOf("_Event_Aggregator");
        var tableName=dbARN.substring(prefix_begin+6,prefix_end);
        console.log(prefix_begin, prefix_end, tableName);  
        
        console.log('DynamoDB Record: %j', record.dynamodb);
        var dbrecord = record.dynamodb;
  
        var aggregated_count = dbrecord.NewImage.count.N;
        var count_updated = new Date(dbrecord.Keys.bucket.S);
        console.log("PUBLISH STATS:");
        console.log(aggregated_count);
        console.log(count_updated);

        var metricName = tableName +cw_metric_suffix;
        var testDatum = {
            MetricName : metricName,
            Unit : 'Count',
            Timestamp: count_updated,
            Value : aggregated_count
        };   
        
      var testParms = {  MetricData : [testDatum],
                       Namespace  : cw_namespace};    
                       
      console.log("Publishing to Cloudwatch for ", metricName);
      cloudwatch.putMetricData(testParms, function(err, data) {
          if (err) context.fail(new Error('ERROR: "' + err + '"' +  err.stack));  
          else context.succeed("Successfully published: " + data);
});


    });
    
};