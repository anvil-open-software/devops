# intro
Initial attempt to automate creation of reverse proxy. 

Note only the linux launch got used and I manually configured the nginx for now. 

jenkins.conf belongs in /etc/nginx/conf.d 

# manual install involved
1. yum install nginx
2. chkconfig nginx on
3. need to add to bottom of nginx.conf
      include  /etc/nginx/conf.d/*.conf;
4. added a /etc/nginx/conf.d jenkins.conf file

# future automation
To automate install nginx, could get jenkins.conf from a S3 bucket   

