#!/bin/bash

# *****************************************************************************
#
# backup-control.sh - Control script that calls the instance backup script and then
# the image pruning script.
#
# ***************************************************************************** 

/home/devops/bin/i-backup.sh && /home/devops/bin/ami-prune.sh
