Playbooks in this directory manage both YARN and hadoop which YARN relies on.

 
### Useful DFS and YARN Commands
The yarn command line can be more useful so you don't have to bother with the http UI to get  quick status.
To recursively list everything in dfs:
``hadoop fs -ls  -R``

To see nodes running: 
``yarn node --list``

To kill applications via command. You can also use the latest UI feature.

``
yarn application -list
yarn application -kill application_XXX 
``

To reload queue and capacity scheduler configuration:

``
yarn rmadmin -refreshQueues
``
### Logging

Logging properties under files/logging is copied over into /opt/yarn

Used with spark-submit from jenkins side with specific property files:

--files /opt/yarn/spark-yarn-verbose-logging.properties

--conf "spark.driver.extraJavaOptions=-Dlog4j.configuration=spark-yarn-verbose-logging.properties"

## YARN version upgrade

Latest yarn version into nexus, which is not automated yet...
``
wget http://mirror.cc.columbia.edu/pub/software/apache/hadoop/common/hadoop-2.7.1/hadoop-2.7.1.tar.gz

curl -v -F hasPom=false -F g=org.apache -F r=releases -F a=hadoop -F e=tgz -F p=tgz \
-F v=2.7.1 -F file=@hadoop-2.7.1.tar.gz \
-u user:password \
http://nexushost:8081/nexus/service/local/artifact/maven/content
``

### Existing Remaining Automation

There are three main areas of automation

1. manage existing cluster
   -  done: restart/shutdown of the dfs/yarn cluster and launching of new drivers is supported.

2. provision and launch new Hadoop/Yarn cluster
   - Use Jenkins Provision Cluster job to create the cluster
   - Potential issues.
        - YARN uses domain names and not IP addresses so in the old way,
           we had to have /etc/hosts have the  I.P. translation for members in the cluster
        - so I converted the linux hostname to return the I.P. address. This appears to work ok but may have issues.

3. creating base image/upgrades
   - done: automation for installing java/scala/hadoop/yarn/spark exist

## Dynamically Adding new member to the cluster not yet automated

For issues on adding dynamically to the cluster see:
http://www.quora.com/How-can-I-add-a-new-node-to-a-running-Hadoop-cluster

https://www.quora.com/How-to-add-a-node-in-Hadoop-cluster