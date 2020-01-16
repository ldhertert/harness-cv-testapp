const winston = require('winston');
const { format } = winston;
const os = require('os')
const splunk = require('./providers/splunk')
const logz = require('./providers/logzio')
const unusualError = require('./unusualError')

const logger = winston.createLogger({
    format: format.combine(
      format.errors({ stack: true }),
      format.metadata(),
      format.json(),
    ),
    transports: [ new winston.transports.Console() ],
    //transports: [ ],
  });

module.exports.start = function(config) {
    config.logger = logger;
    if (config.environment === 'development') {
        logger.level = 'debug';
    }
    let context = { config, logger };
    splunk.init(context);
    logz.init(context);

    startLoggingErrors(context)
}

function startLoggingErrors(context) {
    setInterval(() => {
        context.logger.error(new Error(`This error happens ${context.config.logErrorFrequencyPerMinute} times per minute`));
    }, (60/context.config.logErrorFrequencyPerMinute)*1000)


    if (context.config.logUnusualError) {
        //introduce new error into logs
        setInterval(() => {
            unusualError.logError(context.logger)
        }, 30*1000)
    }
}

