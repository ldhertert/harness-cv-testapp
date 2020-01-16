const config = require('./config');
const appd = require('./providers/appdynamics')
const newRelic = require('./providers/newRelic')

module.exports.start = function(config) {
    //this needs to happen before koa is initialized
    appd.init(config)
    newRelic.init(config)

    const Koa = require('koa');
    var Router = require('koa-router');

    const app = new Koa();
    var router = new Router();

    app
        .use(router.routes())
        .use(router.allowedMethods());

    config.webTransactions.forEach(t => {
        addTransaction(router, t.path, t.responseTime, t.errorRate);
    })

    app.on('error', err => {
        config.logger.error(err);
    });

    app.listen(process.env.PORT || 3000);
}

function addTransaction(router, path, responseTime, errorRate) {
    config.logger.debug(`Adding APM Transaction`, path, responseTime, errorRate)

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