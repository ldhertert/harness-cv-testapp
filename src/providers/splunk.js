const os = require('os');
const SplunkStreamEvent = require('winston-splunk-httplogger');

module.exports.getConfig = () => {
    return {
        enabled: !!(process.env.SPLUNK_TOKEN && process.env.SPLUNK_URL),
        token: process.env.SPLUNK_TOKEN,
        url: process.env.SPLUNK_URL,
        source: process.env.SPLUNK_SOURCE || os.hostname(),
        sourcetype: process.env.SPLUNK_SOURCE_TYPE || 'nodejs',
    }
}

module.exports.init = function(context) {
    if (context.config.splunk.enabled) {
        console.log('INIT: Logging errors to splunk.')
        context.logger.add(new SplunkStreamEvent({ splunk: context.config.splunk }));
    }
}