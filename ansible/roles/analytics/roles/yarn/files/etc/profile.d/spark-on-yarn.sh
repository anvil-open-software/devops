#!/usr/bin/env bash

export PS1="[\u@\H \w]"
#  /etc/profile.d/spark-on-yarn.sh

export JAVA_HOME=/opt/jdk_latest

# HADOOP YARN environment variables
export HADOOP_HOME=/opt/hadoop/hadoop-latest
# try non simlink to see that is the problem
#export HADOOP_HOME=/opt/hadoop/hadoop-2.7.1

export HADOOP_COMMON_HOME=${HADOOP_HOME}
export HADOOP_PREFIX=${HADOOP_HOME}
export HADOOP_CONF_DIR=${HADOOP_HOME}/etc/hadoop
export HDFS_CONF_DIR=${HADOOP_HOME}/etc/hadoop

export HADOOP_HDFS_HOME=${HADOOP_HOME}
export HADOOP_MAPRED_HOME=${HADOOP_HOME}
export HADOOP_YARN_HOME=${HADOOP_HOME}
export YARN_CONF_DIR=$HADOOP_CONF_DIR

export PATH=$PATH:${HADOOP_HOME}/bin:${HADOOP_HOME}/sbin

# useful aliases
alias ll='ls -al'
alias yconf='cd $HADOOP_HOME/etc/hadoop; ll'
alias ylogs='cd $HADOOP_HOME/logs; ll'
# user logs contains Spark
alias ulogs='cd $HADOOP_HOME/logs/userlogs; ll'

alias drivers='cd $SPARK_HOME/drivers; ll'
alias sconf='cd $SPARK_HOME/conf; ll'


export SPARK_HOME=/opt/spark/spark-latest/
