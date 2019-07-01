Summary
-------

This is a sample application to showcase Harness Continuous Verification use cases.  It has an internal web server with automatic load on 4 transactions, and will log errors on a set frequency.  It can be configured to integrate with multiple APM tools & log aggregators. It also has 4 different run modes that can be set via an environment variable.  

Finally, there is an example Harness Application stored as Config as Code in the `Setup` directory.  This includes a kubernetes service, environment mapping, and a Workflow.

The current Docker image can be found at https://hub.docker.com/r/ldhertert/harness-cv-testapp

Usage
-----

To enable New Relic, set the following environment variables

```
NEW_RELIC_LICENSE_KEY=xxxxxxxxxx
NEW_RELIC_APP_NAME=YourNewRelicApp
```

To enable Splunk, set the following environment variables

```
SPLUNK_TOKEN=xxxxxxxxxx
SPLUNK_URL=https://input-prd-p-XXXXXXXX.cloud.splunk.com:8088/services/collector
```

There are 4 different modes to showcase different Harness CV use cases.  You can enable different modes with 
the following environment variable values

```
HARNESS_MODE=NORMAL
HARNESS_MODE=UNKNOWN_EVENT
HARNESS_MODE=UNEXPECTED_FREQUENCY
HARNESS_MODE=APM_REGRESSION
```

Publishing
----------

To publish to Docker Hub, run the following: 

`npm run docker:build && npm run docker:publish` 

Roadmap
-------
* ELK - In progress
* Datadog APM - In progress, see datadog branch
* Datadog Logs - In progress, see datadog branch
* Logz.io - Implemented, not fully tested
* AppDynamics - TBD
* Dynatrace - TBD
* Support for non-kubernetes deployments - TBD