const axios = require('axios');

module.exports.start = function(config) {
    config.webTransactions.forEach(t => {
        console.log(`Making call to ${t.path}`);
        setInterval(() => {
            axios.get(`http://localhost:3000/${t.path}`)
                .then(() => {
    
                })
                .catch(() => {})
        }, (60/t.rpm)*1000);
    });
}