

# Repo access

We use ansible maven_artifact module to download from artifactory.
We currently have a wrapper task download-artifact-from-maven-repo.yml that handles creating dest dir.


You must install lxml where the play is run
``
sudo pip install --upgrade pip
sudo pip install lxml
``