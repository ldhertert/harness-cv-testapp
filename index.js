
const config = require('./config')
const webServer = require('./webServer')
const errorLogger = require('./errorLogger')
const loadGenerator = require('./loadGenerator')

function init() {
    errorLogger.init(config)
    config.webTransactions.forEach(t => {
        webServer.addTransaction(t.path, t.responseTime, t.errorRate);
        loadGenerator.addTransaction(t.path, t.rpm);
    })
}

function start() {
    errorLogger.start()
    webServer.start()
    loadGenerator.start()
}

init()
start()