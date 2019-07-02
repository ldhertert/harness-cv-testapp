module.exports.getConfig = () => {
    return {
        enabled: !!(process.env.NEW_RELIC_LICENSE_KEY && process.env.NEW_RELIC_APP_NAME),
        licenseKey: process.env.NEW_RELIC_LICENSE_KEY,
        appName: process.env.NEW_RELIC_APP_NAME
    }
}

module.exports.init = function(config) {
    if (config.newrelic.enabled) {
        //this needs to happen before koa is required
        console.log('INIT: Instrumenting web server with New Relic.')
        process.env.NEW_RELIC_NO_CONFIG_FILE = true
        require('newrelic');
    }
}