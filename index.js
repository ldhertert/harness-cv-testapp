require('dotenv').config()
const winston = require('winston');
const { format } = winston;
const os = require('os');
const unusualError = require('./unusualError')

let newrelic = null;

if (process.env.NEW_RELIC_LICENSE_KEY && process.env.NEW_RELIC_APP_NAME) {
    process.env.NEW_RELIC_NO_CONFIG_FILE = true
    newrelic = require('newrelic');
}


let config = {
    errorFrequencySeconds: 5,
    splunk: {
        token: process.env.SPLUNK_TOKEN,
        url: process.env.SPLUNK_URL,
        source: process.env.SPLUNK_SOURCE || os.hostname(),
        sourcetype: process.env.SPLUNK_SOURCE_TYPE || 'nodejs',
    }
}

const logger = winston.createLogger({
    format: format.combine(
      format.errors({ stack: true }),
      format.metadata(),
      format.json(),
    ),
    transports: [ new winston.transports.Console() ],
  });

function logError(msg) {
    logger.error(new Error(msg));
}

function addAPMTransaction(path, rpm, responseTime, errorRate) {
    console.log(`Adding APM Transaction`, path, rpm, responseTime, errorRate)

    setInterval(() => {
        newrelic.startWebTransaction(path, () => {
            let transaction = newrelic.getTransaction()
            
            if (Math.random()*100 <= errorRate) {
                newrelic.noticeError(new Error("NullReferenceException"))
            }

            setTimeout(() => {                    
                transaction.end()
            }, responseTime)
        })
    }, (60/rpm)*1000)
}

function run() {
    if (config.splunk.url && config.splunk.token) {
        const SplunkStreamEvent = require('winston-splunk-httplogger');
        logger.add(new SplunkStreamEvent({ splunk: config.splunk }));
    }

    if (newrelic) {
        var impactedResponseTime = process.env.HARNESS_MODE === "APM_REGRESSION" ? 3000 : 20;
        var impactedErrorRate = process.env.HARNESS_MODE === "APM_REGRESSION" ? 75 : 5;

        let transactions = [
            { path: 'home', rpm: 10, responseTime: 5, errorRate: 0},
            { path: 'auth/login', rpm: 20, responseTime: 10, errorRate: 0},
            { path: 'auth/logout', rpm: 3, responseTime: 5, errorRate: 0},
            { path: 'auth/signup', rpm: 5, responseTime: 20, errorRate: impactedErrorRate},
            { path: 'api/items/get', rpm: 50, responseTime: 10, errorRate: 0},
            { path: 'api/items/post', rpm: 12, responseTime: impactedResponseTime, errorRate: 0},
            { path: 'api/items/put', rpm: 25, responseTime: 7, errorRate: 60},
            { path: 'api/items/delete', rpm: 3, responseTime: 3, errorRate: 0}
        ]
        
        transactions.forEach(trans => {
            addAPMTransaction(trans.path, trans.rpm, trans.responseTime, trans.errorRate)
        })
    }

    let frequencyMultiplier = process.env.HARNESS_MODE === "UNEXPECTED_FREQUENCY" ? 100 : 1;
    setInterval(() => {
        logger.error(new Error(`This error usually happens every ${config.errorFrequencySeconds} seconds`));
    }, config.errorFrequencySeconds*frequencyMultiplier*1000)

    
    if (process.env.HARNESS_MODE === "UNKNOWN_EVENT") {
        //introduce new error into logs
        setInterval(() => {
            unusualError.logError(logger)
        }, 30*1000)
    }
}

run()