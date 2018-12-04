#!/bin/bash

# *****************************************************************************
#
# ami-prune.sh - Script to prune DLABS AWS AMI images usedc to backup DLABS AWS
# instances. It filters the list of all DLABS AWS AMI images to include only
# those created by the backup process (description == DLABS INSTANCE BACKUP), 
# and delete those which are older than a given number of days.
#
# *****************************************************************************

source /home/devops/bin/shared-env.sh
 
# get current time in seconds since the Epoch
let "todaySeconds"=$(date +%s)

# The log file
LOG_FILE=/home/devops/log/ami-prune.log
if [ ! -f $LOG_FILE ]; then
    touch $LOG_FILE
fi

echo "$(date +%Y-%m-%d@%T): ********** INSTANCE PRUNE  START **********" >> $LOG_FILE

# Delete backup AMI older than this number of seconds.
# Note that currently we delete backup AMI that are older than 3 days
let "deleteOlderThan=3*24*60*60"

# Temporary file used to cache the list of  AMI
IMAGES=/home/devops/work/images.txt

# Save the list of images in the temporary file
ec2-describe-images --filter "description=$DESCRIPTIONFILTERKEY" | grep IMAGE  > "$IMAGES"

# Inspect each image and delete the old ones
while read image imageId imageName accountId imageStatus visibility architecture imageType rootDeviceType rootDeviceName virtualizationType fieldOne
    do
        # Compute the seconds since EPOCH for this snapshot creation time
        # http://serverfault.com/questions/576974/anyway-to-determine-amazon-machine-image-creation-date
        # ec2-describe-snapshots `ec2-describe-images ami-xxxxxxxx | grep snap | awk '{print $4}'` | head -1 | awk '{print $5}'
        IMAGETIMESTAMP=$(ec2-describe-snapshots `ec2-describe-images $imageId | grep snap | awk '{print $4}'` | head -1 | awk '{print $5}' )
        IFS='T' read -a yyyymmdd <<< "$IMAGETIMESTAMP"
        let "snapshotSeconds = $(date --date="$yyyymmdd" +%s)"
        let "snapshotAge = $todaySeconds-$snapshotSeconds"
        if [ $snapshotAge -gt $deleteOlderThan ]; then
            # Collect the image's snashots
            SNAPSHOTS=$(ec2-describe-images $imageId | grep BLOCKDEVICEMAPPING | cut -f 5)

            # Deregister the image
            ec2-deregister $imageId
            echo "$(date +%Y-%m-%d@%T): Deregister image: $imageId created on $yyyymmdd"  >> $LOG_FILE

            # Delete all the snapshots created to support the imge
            for SNAPSHOT in $(echo $SNAPSHOTS); do
                ec2-delete-snapshot $SNAPSHOT
                echo "$(date +%Y-%m-%d@%T):    Delete snapshot $SNAPSHOT"  >> $LOG_FILE
            done
        else
            # Preserve this image and its snapshots
            echo "$(date +%Y-%m-%d@%T): Deregister image: $imageId created on $yyyymmdd is too young to be deregistered"  >> $LOG_FILE
        fi
    done < "$IMAGES"
echo "$(date +%Y-%m-%d@%T): ********** INSTANCE PRUNE  END   **********"  >> $LOG_FILE
