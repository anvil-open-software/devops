#!/usr/bin/env bash

# Copyright 2018 Dematic, Corp.
# Licensed under the MIT Open Source License: https://opensource.org/licenses/MIT

export PS1="[\u@\H \w]"

export PROMETHEUS_HOME=/etc/prometheus

# useful aliases
alias ll='ls -al'
alias prom='cd $PROMETHEUS_HOME'
alias pconf='cd $PROMETHEUS_HOME/conf; ll'
alias plogs='cd $PROMETHEUS_HOME/logs; ll'


alias prom-restart='sudo service prometheus start;sudo service prometheus status'
alias push-gateway-restart='sudo service prometheus-push-gateway start;sudo service prometheus-push-gateway status'
