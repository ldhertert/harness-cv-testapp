const winston = require('winston');
const { format } = winston;
const SplunkStreamEvent = require('winston-splunk-httplogger');
const unusualError = require('./unusualError')

const logger = winston.createLogger({
    format: format.combine(
      format.errors({ stack: true }),
      format.metadata(),
      format.json(),
    ),
    transports: [ new winston.transports.Console() ],
  });

let config;

module.exports.init = function(c) {
    config = c;

    if (config.splunk.enabled) {
        logger.add(new SplunkStreamEvent({ splunk: config.splunk }));
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

