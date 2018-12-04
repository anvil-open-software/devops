Automation of prometheus and exporter clients.
Currently supported are
* node exporter - machine metrics
* jmx exporter -jvm metrics

### node exporter
Node exporter is a standard Debian package and is run as a service! Done right!


### Running jmx exporter as an agent

-javaagent:file:////opt/prometheus/jmx_exporter/jmx_prometheus_javaagent.jar=5556:file:////opt/prometheus/jmx_exporter/conf/jmx_exporter_empty_rules.yml

### Manually running jmx scraper standalone
Note this server only runs when the host JMX jvm is running

java  -jar /opt/prometheus/jmx_exporter/jmx_prometheus_httpserver-jar-with-dependencies.jar \
 7070 /opt/prometheus/jmx_exporter/jmx_cassandra.yml


java -Dcom.sun.management.jmxremote.ssl=false -Djava.rmi.server.hostname=128.0.0.1 \
 -Dcom.sun.management.jmxremote.authenticate=false -Dcom.sun.management.jmxremote.port=7199 \
 -jar /opt/prometheus/jmx_exporter/jmx_prometheus_httpserver-0.9.jar 7070 \
 /opt/prometheus/jmx_exporter/jmx_cassandra.yml \



