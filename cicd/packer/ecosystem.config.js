module.exports = {
    apps: [{
        name: 'harness-cv-testapp',
        script: 'index.js',

        instances: 1,
        autorestart: true,
        watch: false,
        env: {
            NODE_ENV: 'development'
        },
    }]
};