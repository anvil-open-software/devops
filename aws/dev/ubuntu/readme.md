Jenkins and nexus are the only two ubuntu instances. All others are Amazon Linux.

## adding sudo to user without password challenge

bitnami-admins group does not need password challenge. see visudo

For example:

```
sudo usermod -a -G  sudo mark_eggleston
sudo usermod -a -G  bitnami-admins mark_eggleston
```
