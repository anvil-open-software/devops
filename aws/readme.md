## purpose

This directory precedes adding ansible. Includes AWS cloud formation templates to build the dev environment
as will as security policy documents that we use directly without ansible.

## cloud formation templates vs ansible
The cloud formation templates are still valid for relaunching some of the dev machines like jenkins.
Ansible AWS modules are more concise and easier to use. However ansible modules are not comprehensive and limited.

Currently we use Ansible modules whenever possible.
