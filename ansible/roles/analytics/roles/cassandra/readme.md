## Cassandra NoSQL Store
We chose Cassandra as our nosql database as an alternative to AWS DynamoDB and hbase for the following reasons:
* superior deployment and failover architecture based on peer nodes avoiding the single point of failure and
  bottleneck of a master slave architecture
* superior performance
* tunable consistency

## Cassandra Version
Currently the installed version is Cassandra 3.4 Open Source.
Unfortunately Datastax no longer supports Opscenter on the newer versions and the latest Enterprise version
 is an ancient Cassandra 2.2. So we don't have the benefit of the UI management goodies delivered with opscenter.
 Datastax may release an enterprise version supporting latest Cassandra 3.4 verions late in 2016.

## AWS Specific Configuration

Read latest AWS whitepaper on best practices with a grain of salt.
https://d0.awsstatic.com/whitepapers/AWS_Cassandra_Whitepaper.pdf

### EC2 Instance Types
1. Need high performance disk access which means ephemeral instance store as PIOPs
is ridiculously/ludicrously expensive and limited.  Datastax also recommends instance store.
This means
* c3
* m3 (does not support enhanced network )
* i2 - 800GB
* d2 - massive amounts of instance store, multiples of 2000GB

2. Need high network access
In the above


### cassandra.yml Changes

The following as been updated in the cassandra.yml file
1. phi_convict_threshold: 12

    Set higher to deal with vagaries of ec2 network, default is 8
http://docs.datastax.com/en/cassandra/2.0/cassandra/architecture/architectureDataDistributeFailDetect_c.html

2. endpoint_snitch: GoogleCloudSnitch or Ec2Snitch
See http://docs.datastax.com/en/cassandra/2.0/cassandra/architecture/architectureSnitchEC2_t.html
Helps with request efficiency and makes sure data is evenly replicated between zones. This will be more important for
when we have a multi-zone cluster for failover and high availability

### Default cassandra.yml Configurations Are Correct

Murmur3Partitioner


## Security Configuration
By default, security is internal authentication.
 The jenkins job will  create a spark/password user and update the cassandra password.

## Stress Testing with cassandra-stress tool
See http://www.instaclustr.com/blog/2016/02/08/connecting-to-a-cassandra-cluster-using-tls-ssl/

With the security enabled- you need to add the authentication credentials along with "-mode native csql3"
I.e. calls are

``
cassandra-stress write n=10000  -node 10.x.x.x  -mode native cql3 user=cassandra password=xxxxxx
``

The options are:
``
Usage: -mode thrift [smart] [user=?] [password=?]
 OR
Usage: -mode native [unprepared] cql3 [compression=?] [port=?] [user=?] [password=?] [auth-provider=?] [maxPending=?] [connectionsPerHost=?]
 OR
Usage: -mode simplenative [prepared] cql3 [port=?]
``

## Remaining Work

* Data Backup - for performance, we use ephemeral as recommended by DataStax. However this data must be backed up
to a more persistent form of storage, e.g. to EBS then to S3.
* Failover - cluster spanning multiple data centers.
* Raiding the Linux instance stores: http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/raid-config.html

### Linux Tuning
We may need to resort to Linux tuning for maximum performance.

Recommended to disable swap:
http://docs.datastax.com/en/cassandra/3.x/cassandra/install/installRecommendSettings.html
