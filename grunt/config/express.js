module.exports = {
    options: {
        port: process.env.PORT || 9000
    },
    server: {
        options: {
            script: 'app.js',
            node_env: 'development'
        }
    }
};
