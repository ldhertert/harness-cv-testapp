This application will log errors to Splunk and register web transaction load with New Relic.  

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