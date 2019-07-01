const config = require('./config');

if (config.newrelic.enabled) {
    //this needs to happen before koa is required
    console.log('INIT: Instrumenting web server with New Relic.')
    process.env.NEW_RELIC_NO_CONFIG_FILE = true
    require('newrelic');
}

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

const Koa = require('koa');
var Router = require('koa-router');

const app = new Koa();
var router = new Router();

module.exports.start = function() {
    app
        .use(router.routes())
        .use(router.allowedMethods());

    app.listen(3000);
}

module.exports.addTransaction = function(path, responseTime, errorRate) {
    console.log(`Adding APM Transaction`, path, responseTime, errorRate)

    router.get('/' + path, async (ctx, next) => {
        await next();
        await sleep(responseTime);
        if (Math.random()*100 <= errorRate) {
            throw new Error("TransactionException")
        }
        ctx.body = ""
    });
}

async function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}