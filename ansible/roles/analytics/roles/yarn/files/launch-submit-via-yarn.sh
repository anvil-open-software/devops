#!/usr/bin/env bash
# currently this is file not used directly but is here in case you want to run

/opt/spark/spark-latest/bin/spark-submit \
 --class com.dematic.labs.analytics.store.sparks.drivers.Persister \
 --master yarn-cluster \
 --conf spark.yarn.jar=hdfs://hadoop-namenode:9000/user/spark/share/lib/spark-assembly.jar \
 --conf spark.ui.port=4040  \
 --driver-memory 3g  \
 --num-executors 11 \
 --executor-memory 2g  \
 --executor-cores 1  \
 file:////opt/spark/drivers/spark-store-1.0-SNAPSHOT.jar \
 https://kinesis.us-east-1.amazonaws.com twenty_shards https://dynamodb.us-east-1.amazonaws.com yarn_ 2

#  num-executors is x+1 x=shards
# YARN_CONF_DIR=/opt/yarn/conf
# rm -rf /tmp/hadoop-spark/dfs/data/current/


/opt/spark/spark-latest/bin/spark-submit \
 --class com.dematic.labs.analytics.store.sparks.drivers.Persister \
 --master yarn-cluster \
 --conf spark.yarn.jar=hdfs://hadoop-namenode:9000/user/spark/share/lib/spark-assembly.jar \
 --conf spark.ui.port=4040  \
 --driver-memory 3g  \
 --num-executors 11 \
 --executor-memory 2g  \
 --executor-cores 1  \
 file:////opt/spark/drivers/spark-store-1.0-SNAPSHOT.jar \
 https://kinesis.us-east-1.amazonaws.com twenty_shards https://dynamodb.us-east-1.amazonaws.com yarn_ 2
