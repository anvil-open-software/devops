# DLABS SPARK Deployment setup

Please see diagram in
https://drive.google.com/open?id=1Ne7zuWX9-EHyJSb1GCK4kFgVKsSnk2Yd34H_ajTmWK4

Currently we only support SPARK driver launch on YARN.
(We used to support Spark standalone mode for a Spark only cluster but we no longer do.)

The jenkins job for installing Spark takes a version number.
You can upgrade spark on the same existing cluster since
an install only unzips the distribution and makes the  active spark to a symlink
to /opt/spark/spark-latest.  It is only the $SPARK_HOME/bin and $SPARK_HOME/conf
directories which are used to launch into yarn.

For convenience, we use the YARN master instance to launch the driver although this can be run on any instance with
spark bin.

# Upgrading Spark

## Upgrading Spark to 2.0
Spark 2.0 is a complete departure from previous versions and drivers are not forwards or backwards compatible as the
java API is changed.  Spark deployment for YARN no longer uses a assembly jar file to launch.

As Spark 2.0 is compiled with our current Scala version and we no longer need the kinesis asl,
we can use the Databricks standard distribution
which we store in nexus.

## Upgrading with a Custom Build 1.6 and previous
We only needed to make a custom spark build for our scala version and kinesis asl inclusion.
### Making A Custom Spark Build
Currently we have to make a custom spark build because of including kinesis-asl, different scala version.
The entire pipeline has not been fully automated as somehow the distribution command does
not work on ansible the same way it does on command line.

### Jenkins Job- Download and unzip target spark onto ephemeral drive

Run Jenkins job, download official spark-tgz.yml on a yarn machine. I normally do this on dev master.
http://jenkins:9090/view/Devops%20x%20Analytics/job/SPARK%20Create%20Custom%20Dist/
I will upgrade and regression test on the dev cluster first.

##### Manually change SCALA version
./dev/change-scala-version.sh 2.11

#### Manually make distribution
 ./make-distribution.sh --tgz -Pkinesis-asl -Pyarn -Phadoop-2.6 -Dhadoop.version=2.7.1 -Dprotobuf.version=2.5.0 -Dscala-2.11

This command will build and place a tgz spark-1.6.1-bin-2.7.1.tgz in the root directory and will take 20 minutes.
#### Manually Uploading to Nexus repo

curl -v -F hasPom=false -F g=org.apache -F r=releases -F a=spark -F e=tgz -F p=tgz \
-F v=2.0.0 -F file=@spark-2.0.0-bin-hadoop2.7.tgz \
-u deployment:deployment123 \
http://nexushost:8081/nexus/service/local/artifact/maven/content

See
https://support.sonatype.com/entries/22189106-How-can-I-programatically-upload-an-artifact-into-Nexus-

#### Jenkins Job:  Update Yarn Clusters with latest Spark

Run Jenkins job Provision Configure YARN Cluster Member
The job will soft link the latest assembly jar to $SPARK_HOME/lib/spark-assembly.jar.

Although we only need the spark-assembly jar to launch spark, we update the Spark folder due to the sbin launch folder.

## Upgrading  analytics
You will have to update the pom.xml with the latest revision

