"use strict";
const rethinkdb = require('rethinkdb');
let async = require('async');
class db {
    connectToDb(callback) {
        rethinkdb.connect({
            host : 'localhost',
            port : 28015,
            db : 'contacttracing'
        }, function(err,connection) {
            callback(err,connection);
        });
    }

    addNewUser(userData,callback) {
        let self = this;
        async.waterfall([
            function(callback) {
                self.connectToDb((err,connection) => {
                    if(err) {
                        return callback(true,"Error connecting to database");
                    }
                    callback(null,connection);
                });
            },
            function(connection,callback) {
                rethinkdb.table('users').insert(userData).run(connection,function(err,result) {
                    connection.close();
                    if(err) {
                        return callback(true,"Error happens while adding new user");
                    }
                    callback(null,result);
                });
            }
        ],function(err,data) {
            callback(err === null ? false : true,data);
        });
    }

    findUser(username,callback) {
        let self = this;
        async.waterfall([
            function(callback) {
                self.connectToDb((err,connection) => {
                    if(err) {
                        return callback(true,"Error connecting to database");
                    }
                    callback(null,connection);
                });
            },
            function(connection,callback) {
                rethinkdb.table('users').filter({"username" : username}).run(connection,function(err,cursor) {
                    connection.close();
                    if(err) {
                        return callback(true,"Error fetching user from database");
                    }
                    cursor.toArray(function(err, result) {
                        if(err) {
                            return callback(true,"Error reading cursor");
                        }
                        //Assuming username will be primary key and unique
                        callback(null,result[0]);
                    });
                });
            }
        ],function(err,data) {
            callback(err === null ? false : true,data);
        });
    }

    findUserById(id,callback) {
        let self = this;
        async.waterfall([
            function(callback) {
                self.connectToDb((err,connection) => {
                    if(err) {
                        return callback(true,"Error connecting to database");
                    }
                    callback(null,connection);
                });
            },
            function(connection,callback) {
                rethinkdb.table('users').filter({"id" : id}).run(connection,function(err,cursor) {
                    connection.close();
                    if(err) {
                        return callback(true,"Error fetching user from database");
                    }
                    cursor.toArray(function(err, result) {
                        if(err) {
                            return callback(true,"Error reading cursor");
                        }
                        //Assuming username will be primary key and unique
                        callback(null,result[0]);
                    });
                });
            }
        ],function(err,data) {
            callback(err === null ? false : true,data);
        });
    }

    addNewEntry(entryData,callback) {
        let self = this;
        async.waterfall([
            function(callback) {
                self.connectToDb((err,connection) => {
                    if(err) {
                        return callback(true,"Error connecting to database");
                    }
                    callback(null,connection);
                });
            },
            function(connection,callback) {
                rethinkdb.table('entries').insert(entryData).run(connection,function(err,result) {
                    connection.close();
                    if(err) {
                        return callback(true,"Error happens while adding entry");
                    }
                    callback(null,result);
                });
            }
        ],function(err,data) {
            callback(err === null ? false : true,data);
        });
    }

    getAllEntriesOfUser(user_id,callback) {
        let self = this;
        async.waterfall([
            function(callback) {
                self.connectToDb((err,connection) => {
                    if(err) {
                        return callback(true,"Error connecting to database");
                    }
                    callback(null,connection);
                });
            },
            function(connection,callback) {
                rethinkdb.table('entries').filter({"parent_id" : user_id}).run(connection,function(err,cursor) {
                    connection.close();
                    if(err) {
                        return callback(true,"Error fetching entries from database");
                    }
                    cursor.toArray(function(err, result) {
                        if(err) {
                            return callback(true,"Error reading cursor");
                        }
                        //Assuming username will be primary key and unique
                        callback(null,result);
                    });
                });
            }
        ],function(err,data) {
            callback(err === null ? false : true,data);
        });
    }

    findEntryById(id,callback) {
        let self = this;
        async.waterfall([
            function(callback) {
                self.connectToDb((err,connection) => {
                    if(err) {
                        return callback(true,"Error connecting to database");
                    }
                    callback(null,connection);
                });
            },
            function(connection,callback) {
                rethinkdb.table('entries').filter({"id" : id}).run(connection,function(err,cursor) {
                    connection.close();
                    if(err) {
                        return callback(true,"Error fetching entry from database");
                    }
                    cursor.toArray(function(err, result) {
                        if(err) {
                            return callback(true,"Error reading cursor");
                        }
                        //Assuming username will be primary key and unique
                        callback(null,result[0]);
                    });
                });
            }
        ],function(err,data) {
            callback(err === null ? false : true,data);
        });
    }
}

module.exports = db;