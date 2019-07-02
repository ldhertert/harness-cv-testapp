module.exports = {
    logError: function(logger) {
        try {
            decodeURIComponent('%');
        } catch (e) {
            logger.error(e);
        }
    }
}