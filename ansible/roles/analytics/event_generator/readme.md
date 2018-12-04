For launching multiple instances of KinesisEventClient to generate event traffic to test the Spark cluster.

To assert correctness

1. KinesisEventClient - output to raw text in /tmp/xxx.par file
2. Kinesis Service via Cloudwatch
3. Spark Streaming (on YARN UI)
4. Dynamo DB counts registered by aggregation driver
4b. Stats