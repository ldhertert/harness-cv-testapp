const os = require('os');
const LogzioWinstonTransport = require('winston-logzio');

module.exports.getConfig = () => {
    return {
        enabled: !!process.env.LOGZIO_TOKEN,
        token: process.env.LOGZIO_TOKEN,
    }
}

module.exports.init = function(context) {
    if (context.config.logzio.enabled) {
        console.log('INIT: Logging errors to logz.io')
        const logzio = new LogzioWinstonTransport({
            level: 'error',
            name: 'harness-cv-testapp',
            token: context.config.logzio.token,
            extraFields: {
                hostname: os.hostname()
            } 
        });
        context.logger.add(logzio)
    }
}