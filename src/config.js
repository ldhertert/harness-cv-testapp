require('dotenv').config()
const appd = require('./providers/appdynamics')
const newRelic = require('./providers/newRelic')
const splunk = require('./providers/splunk')
const logz = require('./providers/logzio')

let config = {
    environment: process.env.environment || "production",
    logErrorFrequencyPerMinute: 5,
    logUnusualError: process.env.HARNESS_MODE === "UNKNOWN_EVENT",
    splunk: splunk.getConfig(),
    newrelic: newRelic.getConfig(),
    appd: appd.getConfig(),
    logzio: logz.getConfig(),
    webTransactions: [
        { path: 'home', rpm: 10, responseTime: 20, errorRate: 0},
        { path: 'auth/login', rpm: 20, responseTime: 10, errorRate: 0},
        { path: 'auth/logout', rpm: 3, responseTime: 5, errorRate: 0},
        { path: 'auth/signup', rpm: 200, responseTime: 20, errorRate: 20}
    ]
}

if (process.env.HARNESS_MODE === "APM_REGRESSION") {
    config.webTransactions[0].responseTime = 3000
}

if (process.env.HARNESS_MODE === "APM_REGRESSION") {
    config.webTransactions[3].errorRate = 75
}

if (process.env.HARNESS_MODE === "UNEXPECTED_FREQUENCY") {
    config.logErrorFrequencyPerMinute = 200;
}

console.log('Config:', JSON.stringify(config, null, 4))

module.exports = config;