const winston = require('winston');
const { format } = winston;
const SplunkStreamEvent = require('winston-splunk-httplogger');
const os = require('os')
const unusualError = require('./unusualError')

const logger = winston.createLogger({
    format: format.combine(
      format.errors({ stack: true }),
      format.metadata(),
      format.json(),
    ),
    //transports: [ new winston.transports.Console() ],
    transports: [ ],
  });

let config;

module.exports.init = function(c) {
    config = c;

    if (config.splunk.enabled) {
        console.log('INIT: Logging errors to splunk.')
        logger.add(new SplunkStreamEvent({ splunk: config.splunk }));
    }

    if (config.logzio.enabled) {
        console.log('INIT: Logging errors to logz.io')
        const LogzioWinstonTransport = require('winston-logzio');
        const logzio = new LogzioWinstonTransport({
            level: 'error',
            name: 'harness-cv-testapp',
            token: config.logzio.token,
            extraFields: {
                hostname: os.hostname()
            } 
        });
        logger.add(logzio)
    }
}

module.exports.start = function() {
    setInterval(() => {
        logger.error(new Error(`This error happens ${config.logErrorFrequencyPerMinute} times per minute`));
    }, (60/config.logErrorFrequencyPerMinute)*1000)


    if (config.logUnusualError) {
        //introduce new error into logs
        setInterval(() => {
            unusualError.logError(logger)
        }, 30*1000)
    }
}

