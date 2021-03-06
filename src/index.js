#!/usr/bin/env node

const config = require('./config')
const webServer = require('./webServer')
const errorLogger = require('./errorLogger')
const loadGenerator = require('./loadGenerator')

function start() {
    errorLogger.start(config)
    config.logger.debug("Starting application with config", config)
    
    webServer.start(config)
    loadGenerator.start(config)
}

start()