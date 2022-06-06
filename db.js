var mysql = require('mysql');

const createDb = async (db) => {
    let query = `CREATE DATABASE IF NOT EXISTS test_messageapi;
    CREATE TABLE IF NOT EXISTS test_messageapi.messagelog (
        messageLogId int NOT NULL AUTO_INCREMENT,
        senderId int NOT NULL,
        recipientId int NOT NULL,
        textMessage text DEFAULT NULL,
        messageTimestamp datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (messageLogId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`;

    db.query(query, (err, result) =>{
        if(err) throw err;
    });

};

const getAllMessagesForUser = async (db, userId, callback) => {
    let query = ` SELECT * FROM test_messageapi.messagelog
    WHERE recipientId = ${userId} AND messageTimestamp > SUBDATE(NOW(), 30)
    ORDER BY 1 DESC LIMIT 100`;

    db.query(query, (err, result) => {
        if(err) throw err;
        return callback(result);
    });

};

const getMessagesForUser = async (db, userId, senderId, callback) => {
    let query = ` SELECT * FROM test_messageapi.messagelog
    WHERE recipientId = ${userId} AND senderId = ${senderId} AND messageTimestamp > SUBDATE(NOW(), 30)
    ORDER BY 1 DESC LIMIT 100`;

    db.query(query, (err, result) => {
        if(err) throw err;
        return callback(result);
    });
};

const recordMessageForUser = async (db, userId, recipientId, message) => {
    let query = ` INSERT INTO test_messageapi.messagelog (senderId, recipientId, textMessage)
    VALUES (${userId}, ${recipientId}, "${message}");`;

    db.query(query, (err, result) =>{
        if(err) throw err;
    });
}

exports.createDb = createDb;
exports.getAllMessagesForUser = getAllMessagesForUser;
exports.getMessagesForUser = getMessagesForUser;
exports.recordMessageForUser = recordMessageForUser;