## Instance Backups

Backups are controlled by tag called "Backup" on the EC2 instance.
Any existing value will trigger a nightly backup as it's only the presence of the tag checked.'

Backups are stored and pruned for three days with the Description "DLABS_INSTANCE_BACKUP".
(This should be modified so pruning is controlled with a tag instead of a description so it
can be dynamically modified after creation.)
