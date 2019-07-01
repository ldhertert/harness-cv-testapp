Summary
-------

This is a sample application to showcase Harness Continuous Verification use cases.  It has an internal web server with automatic load on 4 transactions, and will log errors on a set frequency.  It can be configured to integrate with multiple APM tools & log aggregators. It also has 4 different run modes that can be set via an environment variable.  

Finally, there is an example Harness Application stored as Config as Code in the `Setup` directory.  This includes a kubernetes service, environment mapping, and a Workflow.

The current Docker image can be found at https://hub.docker.com/r/ldhertert/harness-cv-testapp

Usage
-----

**Prerequisites**: Existing Harness account with connectors in place for docker registry, kubernetes cluster, and a working delegate.

-----

1) Fork this repository
2) Clone your fork to your local machine
3) **Optional** - Publish docker image to your own repository

   * Modify `package.json`  and put your repo/image information in the following section

       ```json
       "config": {
           "imageRepo": "ldhertert/harness-cv-testapp"
       }
       ```

   * Ensure you have permissions to push to the target repo via `docker push`, and then run 

       ```bash
       npm install
       
       # These are just helper shortcuts.  Normal docker build/push commands work as well.
       npm run docker:build
       npm run docker:publish
       ```
4) In Harness, [create a new Git connector](https://docs.harness.io/article/ay9hlwbgwa-add-source-repo-providers) that points to your forked repository
5) [Create a new Harness application](https://docs.harness.io/article/bucothemly-application-configuration#create_an_application) called `harness-cv-testapp` and configure it with Git sync using your new git connector.
6) Harness does not currently import preexisting config as code when a new application is created, so we need to revert a commit that was automatically made.  On your local machine, within the cloned git repo, run the following

    ```bash
    git pull
    git revert HEAD --no-edit
    git push origin master
    ```

7) You will probably [get a notification](https://imgur.com/UuiUMTE.png) in the Harness UI that Harness was unable to process some changes from Git.  We just need to tweak one thing.  Click the link from the notification, find the error for `Applications/harness-cv-testapp/Environments/Dev/Service Infrastructure/k8s-dev.yaml` (you can ignore any other errors), click **Fix This** and edit the value of `computeProviderName` to the name of your Kubernetes cloud provider in Harness.  This should match the name displayed on the `Setup -> Cloud Providers` page.
   
   ![YAML Edit Screenshot](https://i.imgur.com/spaN2cg.png)
8) Now that your YAML is imported, we need to customize a few things:

    * In the Service editor, [add the docker image as an artifact](https://imgur.com/9tIPBIJ.png) and [set the values](https://imgur.com/SgMFMqk) for your New Relic API Key, New Relic Application Name, Splunk URL, and Splunk Token.
    * In the Environments, modify the infra mapping if needed to specify namespace
    * In the Workflow, click into the Canary phase.  In the verification steps, update New Relic Server, New Relic App Name, and Splunk Server.

9) You're ready to start deploying.  Execute the workflow, and select `Normal` for the `TestMode` parameter.  This will perform an initial deployment with normal expected performance.

10) Execute additional deployments with different `TestMode` values to prove out different failure use cases.  Verification should fail, and Harness should automatically roll back to the `Normal` artifact.

Direct Docker Usage
-------------------

To enable New Relic, set the following environment variables

```
NEW_RELIC_LICENSE_KEY=xxxxxxxxxx
NEW_RELIC_APP_NAME=YourNewRelicApp
```

To enable AppDynamics, set the following environment variables

```
APPD_CONTROLLER_URL=https://myinstance.saas.appdynamics.com
APPD_ACCESS_KEY=xxxx
#Optional config settings, will be inferred if excluded
APPD_APPLICATION_NAME (default harness-cv-testapp)
APPD_ACCOUNT_NAME (inferred from URL if SaaS, customer1 if non-SaaS url)
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

Changelog
---------

* 1.1.0 - July 1, 2019 - Added support for AppDynamics APM
* 1.0.0 - June 30, 2019 - Initial release.  Support for New Relic & Splunk on Kubernetes.

Roadmap
-------
* ELK - In progress
* Datadog APM - In progress, see datadog branch
* Datadog Logs - In progress, see datadog branch
* Logz.io - Implemented, not fully tested
* AppDynamics - TBD
* Dynatrace - TBD
* Support for non-kubernetes deployments - TBD
