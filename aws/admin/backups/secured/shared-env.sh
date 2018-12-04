#!/bin/bash
export SHELL=/bin/bash
export PWD=/home/devops/bin

# Environment Variables as cron doesn't load them
export EC2_AMITOOL_HOME=/opt/aws/amitools/ec2
export AWS_PATH=/opt/aws
export EC2_HOME=/opt/aws/apitools/ec2
export JAVA_HOME=/usr/lib/jvm/jre

#export AWS_CLOUDWATCH_HOME=/opt/aws/apitools/mon
#export AWS_AUTO_SCALING_HOME=/opt/aws/apitools/as
#export AWS_ELB_HOME=/opt/aws/apitools/elb
#export AWS_RDS_HOME=/opt/aws/apitools/rds

export PATH=$PATH:$EC2_HOME/bin


# Filter key used to search for AMI candidates
export DESCRIPTIONFILTERKEY="DLABS_INSTANCE_BACKUP"
