#!/bin/bash

# *****************************************************************************
#
# i-backup.sh - Script to backup DLABS AWS instances. It creates AWS Images,
# AMI of any instance with tag Backup
#
# ***************************************************************************** 
source /home/devops/bin/shared-env.sh

# The log file
LOG_FILE=/home/devops/log/i-backup.log
if [ ! -f $LOG_FILE ]; then
    touch $LOG_FILE
fi

# Get a list of all instances that are filtered with having Backup tag defined.
INSTANCES=$(ec2-describe-instances --filter "tag-key=Backup" | grep INSTANCE | cut -f 2)
# --filter "instance-state-name=running"   for those running

# debug statements
# echo env $(env) >> $LOG_FILE
# echo regions $(ec2-describe-regions)  >> $LOG_FILE

echo "$(date +%Y-%m-%d@%T): ********** INSTANCE BACKUP START **********" >> $LOG_FILE
echo "region= $(aws configure get region) with instances: $INSTANCES " >> $LOG_FILE
for INSTANCE in $(echo $INSTANCES); do
                AMI_NAME=$INSTANCE
                AMI_NAME+="_on_"
                AMI_NAME+=$(date +%Y%m%d-%H%M%S)
#                ec2-create-image $INSTANCE --name $AMI_NAME --description $DESCRIPTIONFILTERKEY >> $LOG_FILE
                echo "    $(date +%Y-%m-%d@%T): Request sent for $INSTANCE back up as $AMI_NAME" >> $LOG_FILE
done
echo "$(date +%Y-%m-%d@%T): ********** INSTANCE BACKUP END   **********" >> $LOG_FILE

