The azure integration uses combination of ansible modules and ansible CLI.

##VM Provisioning
### Tag management
app_category  i.e. dsp

# app_name

In Azure, all tags will be generic instead of using unique tags like KAFKA_CLUSTER so we can use generic plays

* app-category: "{{app_category}}"
i.e. dsp or dcf

* app-name: "{{app_name}}"
i.e. yarn

* app-cluster-id: "{{app_cluster_name}}"
i.e. dev/demo/regression etc...

* app-cluster-member-type: "{{app_cluster_member_type}}" i.e. master, node, broker
** for YARN
** for Kafka
** for

* app-combo-id: "{{app_name}}_{{app_cluster_name}}", used for startup/shutdown
** for YARN, YARN_devops etc...

* prometheus_job_name- used for ONLY the machine node exporter and for now must match GCP legacy targets
http://10.x.x.x:9090/targets