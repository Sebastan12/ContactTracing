const r = require('rethinkdb');

const config = {
    host: 'localhost',
    port: '28015'
};

function connect() {
    return new Promise((resolve, reject) => {
        r.connect(config, (error, connection) => {
            if (error) {
                reject(error);
            }
            console.info("Connected to Server");
            resolve(connection);
        });
    });
}

module.exports = connect;