const url = require('url');

module.exports.getConfig = () => {
    let config = {
        enabled: !!(process.env.APPD_CONTROLLER_URL && process.env.APPD_ACCESS_KEY),
        controllerUrl: process.env.APPD_CONTROLLER_URL,
        accessKey: process.env.APPD_ACCESS_KEY,
        applicationName: process.env.APPD_APPLICATION_NAME || 'harness-cv-testapp'
    };

    if (config.enabled) {
        let parsed = url.parse(config.controllerUrl);
        config.controllerHostName = parsed.hostname;
        config.controllerSslEnabled = parsed.protocol.toLowerCase() === 'https:';
        config.controllerPort = parsed.port ? parseInt(parsed.port) : (config.controllerSslEnabled ? 443 : 80);
        if (process.env.APPD_ACCOUNT_NAME) {
            config.accountName = process.env.APPD_ACCOUNT_NAME;
        } else if (config.controllerHostName.toLowerCase().indexOf('.saas.appdynamics.com') > 0) {
            config.accountName = config.controllerHostName.split('.')[0];
        } else {
            config.accountName = 'customer1';
        }
    }
    return config;
}

module.exports.init = function(config) {
    if (config.appd.enabled) {
        require("appdynamics").profile({
            controllerHostName: config.appd.controllerHostName,
            controllerPort: config.appd.controllerPort, 
            controllerSslEnabled: config.appd.controllerSslEnabled,
            accountName: config.appd.accountName,
            accountAccessKey: config.appd.accessKey,
            applicationName: config.appd.applicationName,
            tierName: 'harness-cv-testapp-web',
            nodeName: 'process' // The controller will automatically append the node name with a unique number
        });
    }
}