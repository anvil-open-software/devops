# purpose
As zeppelin is going to be used for demo purposes only, we do not have full automation from provisioning to install

#provision manually with
gcloud compute --project "dlabs-dev-primary" instances create "zeppelin-dev-10-207-220-60" \
 --zone "us-central1-c" \
 --machine-type "n1-standard-2" --subnet "subnet-xxx-dev-us-central1" --private-network-ip "10.x.x.x" \
 --no-address --metadata "ZEPPELIN_ID=dev" --maintenance-policy "MIGRATE" \
 --scopes ansible-automation@dlabs-dev-primary.iam.gserviceaccount.com="https://www.googleapis.com/auth/cloud-platform" \
 --tags "private-instance-us-central1" --image "debian-8-jessie-v20170124" --image-project "debian-cloud" \
 --boot-disk-size "10" --boot-disk-type "pd-ssd" --boot-disk-device-name "zeppelin-dev-10-207-220-60"

 # install