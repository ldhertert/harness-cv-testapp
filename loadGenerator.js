const axios = require('axios');

let transactions = [];

module.exports.addTransaction = function (path, rpm) {
    transactions.push({path, rpm})
}

module.exports.start = function() {
    transactions.forEach(t => {
        console.log(`Making call to ${t.path}`);
        setInterval(() => {
            axios.get(`http://localhost:3000/${t.path}`)
                .then(() => {
    
                })
                .catch(() => {})
        }, (60/t.rpm)*1000);
    });
}