#!/usr/bin/env bash

# Copyright 2018 Dematic, Corp.  # Licensed under the MIT Open Source License: https://opensource.org/licenses/MIT
export PS1="[\u@\H \w]"

export JAVA_HOME=/opt/jdk_latest
export SPARK_HOME=/opt/spark/spark-latest/

# useful aliases
alias ll='ls -al'
alias spark='cd $SPARK_HOME'
alias sconf='cd $SPARK_HOME/conf; ll'
alias slogs='cd $SPARK_HOME/logs; ll'





