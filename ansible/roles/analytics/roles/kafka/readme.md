## Kafka Version
## Kafka Automation
ansible scripts in this directory control the provisioning, configuring of a multi-node kafka cluster.

http://www.bogotobogo.com/Hadoop/BigData_hadoop_Zookeeper_Kafka_single_node_Multiple_broker_cluster.php

## kafka deployment
### zookeeper
kafka relies on zookeeper to keep track of the cluster so you must first
start a zookeeper instance to run a kafka cluster.

In production you would have a separate zookeeper cluster for failover but for the purposes of our minimal
test system, we have
1. single zookeeper
2. 3+ kafka nodes

Currently, the instances are almost identical and it's by convention I use the first member of the cluster as
a zookeeper by running the zookeeper script, and the kafka startup script on the rest.
(A todo would be to segregate it a little more- perhaps name and tag the differently, and have the zookeeper have
a lower instance type. )

## Automation
### no linux service and not using ansible handlers
We do not install zoo keeper as a service or kafka as a service for now as we want to tightly control cluster start order.

I do not bother using handlers with this kafka cluster as there is really only one call to each of the stop and start,
and it has to happen immediately to do a health check.

## yahoo kafka-manager

There is no management UI which makes debugging complicated so I added Yahoo's kafka manager:
https://github.com/yahoo/kafka-manager
(There is no better UI currently, but unfortunately
this is something you have to manually build yourself via sbt as Yahoo does not provide executables.
You have to install activator. See http://www.scala-sbt.org/0.13/docs/Installing-sbt-on-Linux.html

We currently build on jenkins box.

(Since the latest does not yet support Kafka 0.10, I have built from the head using
a user submitted pull request 282)
https://github.com/yahoo/kafka-manager/pull/282

#### Manually uploading to kafka-manager to repo

Artifactory- use the UI
http://yourartifactory/artifactory/webapp/#/artifacts/browse/tree/General/maven-dlabs-release/com/yahoo/kafka-manager


Old nexus repo:
curl -v -F hasPom=false -F g=com.yahoo -F r=releases -F a=kafka-manager -F e=zip -F p=zip \
-F v=1.3.1.8 -F file=@kafka-manager-1.3.3.8.zip \
-u deployment:password \
http://nexus:8081/nexus/service/local/artifact/maven/content


### Partitioning
#### Sequencing
"Partitions also allow you sequential gaurantees. This means if you need related messages processed in order,
you can do that by routing them to the same partition.
When a consumer reads that topic, the messages will arrive in the order they were received."

I.e. send  messages for same device to same partition!

###
http://www.slideshare.net/jhols1/kafka-reliability-guarantees-atl-kafka-user-group
http://blog.cloudera.com/blog/2015/03/exactly-once-spark-streaming-from-apache-kafka/

#
## performance comparison

http://www.cloudera.com/documentation/kafka/latest/topics/kafka_performance.html

http://insightdataengineering.com/blog/ingestion-comparison/

## Built in kafka performance tester org.apache.kafka.tools.ProducerPerformance

To confirm kafka cluster itself is running fine without the rest of the components,
you can use the kafka shipped tools
https://gist.github.com/jkreps/c7ddb4041ef62a900e6c

An example run would be:
``
/opt/kafka-latest/bin/kafka-run-class.sh org.apache.kafka.tools.ProducerPerformance --topic devops-healthcheck --num-records 50000000 --record-size 100 --throughput -1 --producer-props acks=1  bootstrap.servers=10.207.222.10:9092,10.207.222.11:9092  buffer.memory=67108864 batch.size=8196
``

``
devops@kafka-producer-devops-10-207-222-51:/opt/kafka/kafka_2.11-0.10.1.0/bin$ ./kafka-run-class.sh org.apache.kafka.tools.ProducerPerformance --topic devops-healthcheck --num-records 100000000 --record-size 100 --throughput -1 --producer-props acks=1 bootstrap.servers=10.207.222.10:9092,10.207.222.11:9092 buffer.memory=67108864 batch.size=8196
2462884 records sent, 492576.8 records/sec (46.98 MB/sec), 5.8 ms avg latency, 207.0 max latency.
3871630 records sent, 774326.0 records/sec (73.85 MB/sec), 2.2 ms avg latency, 27.0 max latency.
3794690 records sent, 758938.0 records/sec (72.38 MB/sec), 2.3 ms avg latency, 25.0 max latency.
3777157 records sent, 755431.4 records/sec (72.04 MB/sec), 2.3 ms avg latency, 39.0 max latency.
3765728 records sent, 753145.6 records/sec (71.83 MB/sec), 3.0 ms avg latency, 32.0 max latency.
3804533 records sent, 760602.4 records/sec (72.54 MB/sec), 3.0 ms avg latency, 128.0 max latency.
3774501 records sent, 754900.2 records/sec (71.99 MB/sec), 2.3 ms avg latency, 42.0 max latency.
3739722 records sent, 747944.4 records/sec (71.33 MB/sec), 3.3 ms avg latency, 108.0 max latency.
3633164 records sent, 726632.8 records/sec (69.30 MB/sec), 4.4 ms avg latency, 125.0 max latency.
``

For extended run  50000000000
``
date
/opt/kafka_latest/bin/kafka-run-class.sh org.apache.kafka.tools.ProducerPerformance \
--topic devops-healthcheck --num-records 5000000000 --record-size 100 \
--throughput -1 --producer-props acks=-1  \
bootstrap.servers=10.207.220.10:9092,10.207.220.11:9092  \
buffer.memory=671088640 batch.size=8196 > ~/kafka_perf.log &
tail -f ~/kafka_perf.log

``