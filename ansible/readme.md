Copyright 2018, Dematic, Corp.

Currently playbooks in this directory are used by
1. jenkins via ansible plugin
2. local testing for developing scripts
3. Ansible Tower (currently no longer used,
     early Tower versions did not automatically pick up a play book unless it is on this top level directory.)

## Max install
 You must specify the version as by default it installs 2.0
 ``
 sudo pip install ansible==2.0.1
  ``
 ## Jenkins Tips
 Note any variable defined in these static ansible files can be overridden in Jenkins extra-vars, i.e.
 ``
 --extra-vars "spark_ami_id='$AMI_IMAGE'"
 ``
 
 Background jobs with ad-hoc commands can be launched with "-B 3600 -P 0" parms

## Ansible upgrade on Jenkins
 In order to do an ansible upgrade, we just create a clone to do the testing.

 1. launch secondary jenkins AMI for testing using jenkins CloudFormation template JenkinsLaunch.template
 2. upgrade via apt-get on the secondary jenkins
    http://docs.ansible.com/ansible/intro_installation.html#latest-releases-via-apt-ubuntu
 3. restart jenkins
   -- change the ansible label to the correct version from "Manage Jenkins"", Ansible section.
      The install just points to /usr/bin
 4. Testing full launch
   -- Data Pipeline Regression
   -- iqpoc Pipeline Regression
   -- AWS shutdown

 5. upgrade on real jenkins
 6. delete the cloned jenkins CloudFormation stack (have to change termination protection)

To upgrade on your mac:

``sudo pip install ansible=2.0``


## Ansible 2.0 Changes

The following were updated
1. ec2 module now supports termination protection
2. DynamoDB module deletes

The following needs to be changed due to deprecation
1. sudo use
2. raw variable use without "{{}}"""

The following needs to be adopted
2. Block usage with better error handling
