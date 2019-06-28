require('dotenv').config()
const winston = require('winston');
const { format } = winston;
const os = require('os');

let config = {
    errorFrequencySeconds: process.env.ERROR_FREQUENCY ? parseInt(process.env.ERROR_FREQUENCY) : 60,
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

function simulateAPMTransaction(name, responseTime, error) {

}

function run() {
    if (config.splunk.url && config.splunk.token) {
        const SplunkStreamEvent = require('winston-splunk-httplogger');
        logger.add(new SplunkStreamEvent({ splunk: config.splunk }));
    }

    setInterval(() => {
        logError("testing")
    }, config.errorFrequencySeconds*1000)

}

run()