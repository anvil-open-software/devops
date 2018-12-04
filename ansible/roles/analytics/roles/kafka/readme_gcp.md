# Level of Automation
The following is automated through ansible scripts invoked via Jenkins
 * provisioning
 * cluster startup
 * instance type config

## increasing disk size
However disk increasing is not automated. You have two options
 1. reprovision the cluster specifying larger
 2 or invoke gcp increase size manually as below

parallel gcloud compute disks resize yarn-regression-worker-10-207-223-21 --size 200



