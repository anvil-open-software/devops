Copyright 2018, Dematic, Corp.


# GCP automation

## ansible GCP module

We do NOT use the gcp ansible modules by default since they are too immature at this stage
and instead use the gcloud API directly for greater flexiblity and better debugging.

E.g. Currently the latest ansible gce module is v2.1 and in 2.2 they just added subnet support but did not add private addresses.
I had the same issues with the ansible ec2 module where despite lack of functionality,
I used the ec2 module only to regret it later.  Certain features like mapping multiple IAS drives did not work as expected.

## service accounts
GCE did not always appear to make the default service accounts work. I had to manually reauthorize them on the Jenkins server
gcloud auth activate-service-account [ACCOUNT] --key-file KEY_FILE

# debian
We use latest GCP house Linux Debian image.

# GCE Tips

## instance status
When using the API:
Note GCE "TERMINATED" == AWS "STOPPED"
https://cloud.google.com/compute/docs/instances/checking-instance-status

##  Creating an image

Do not follow official docs to kill the attached instance. Follow less invasive procedure found on forum:
1. create snapshot from instance
2. create disk from snapshot
3. create image from snapshot
Note this cannot be done from the console, only command line:
``
gcloud compute disks create jenkins-image-disk \
     --project migration-xxx --source-snapshot=jenkins-ubuntu-snapshot1 \
     --type=pd-ssd
``

 ## Launch image between projects
``
    gcloud compute instances create devops-jenkins \
      --project "dlabs-dev-primary" \
      --subnet "dlabs-private-dev-us-central1" --private-network-ip "10.x.x.x" \
      --image="https://www.googleapis.com/compute/v1/projects/migration-xxx/global/images/jenkins-migration-1" \
      --boot-disk-size 24GB --machine-type=n1-standard-2 \
      --zone=us-central1-f --boot-disk-type "pd-ssd"
``