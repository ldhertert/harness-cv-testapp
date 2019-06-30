require('dotenv').config()
const os = require('os');

let defaults = {
    logErrorFrequencyPerMinute: 5,
    logUnusualError: process.env.HARNESS_MODE === "UNKNOWN_EVENT",
    splunk: {
        enabled: process.env.SPLUNK_TOKEN && process.env.SPLUNK_URL,
        token: process.env.SPLUNK_TOKEN,
        url: process.env.SPLUNK_URL,
        source: process.env.SPLUNK_SOURCE || os.hostname(),
        sourcetype: process.env.SPLUNK_SOURCE_TYPE || 'nodejs',
    },
    newrelic: {
        enabled: process.env.NEW_RELIC_LICENSE_KEY && process.env.NEW_RELIC_APP_NAME
    },
    logzio: {
        enabled: !!process.env.LOGZIO_TOKEN,
        token: process.env.LOGZIO_TOKEN,
    },
    webTransactions: [
        { path: 'home', rpm: 10, responseTime: 20, errorRate: 0},
        { path: 'auth/login', rpm: 20, responseTime: 10, errorRate: 0},
        { path: 'auth/logout', rpm: 3, responseTime: 5, errorRate: 0},
        { path: 'auth/signup', rpm: 200, responseTime: 20, errorRate: 20}
    ]
}

if (process.env.HARNESS_MODE === "APM_REGRESSION") {
    defaults.webTransactions[0].responseTime = 3000
}

if (process.env.HARNESS_MODE === "APM_REGRESSION") {
    defaults.webTransactions[3].errorRate = 75
}

if (process.env.HARNESS_MODE === "UNEXPECTED_FREQUENCY") {
    defaults.logErrorFrequencyPerMinute = 200;
}
    

module.exports = defaults;