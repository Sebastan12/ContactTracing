const r = require('rethinkdb');
const express = require('express');

const databaseName = 'webDev2021';
const tableName = 'webDevEntries';

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

function getAllEntries(connection) {
    return new Promise((resolve, reject) => {
        r.db(databaseName).table(tableName).run(connection, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    });
}

const app = express();

app.get('/create', (request, response) => {
    connect().then((connection) => {
        r.dbList()
            .contains(databaseName)
            .do((containsDatabase) => {
                return r.branch(containsDatabase, { created: 0 }, r.dbCreate(databaseName));
            }).run(connection, function (error, result) {
                if (error) {
                    console.error(error);
                    response.sendStatus(500);
                } else {
                    r.db(databaseName)
                        .tableList()
                        .contains(tableName)
                        .do(function (containsTable) {
                            return r.branch(containsTable, { created: 0 }, r.db(databaseName).tableCreate(tableName));
                        }).run(connection, function (error, result) {
                            if (error) {
                                console.error(error);
                                response.sendStatus(500);
                            } else {
                                response.sendStatus(200);
                            }
                        });
                }
            });
    });
});

app.get('/createEntry', (request, response)=>{
    connect().then((connection) => {
        const entry = {topic: 'ExpressJs', date: new Date(), level: 'Advanced', lecture: 'Web-Dev'};
        r.db(databaseName)
        .table(tableName)
        .insert(entry).run(connection, (error, result) => {
            if(error){
                response.sendStatus(500);
            }
            response.sendStatus(200);
        });
    });
});

app.get('/entries', (request, response) => {
    connect().then((connection) => {
        getAllEntries(connection).then((cursor) => {
            if (!cursor) {
                response.sendStatus(500);
            }
            cursor.toArray((error, result) => {
                if (error) {
                    response.sendStatus(500);
                }
                response.send(JSON.stringify(result));
            });
        });
    });
});

app.listen(9999, () => {
    console.log("Server listening on port 9999");
});
