const express = require('express');
const app = express();
const PORT = 8000;


var mysql = require('mysql'); 
const { createDb, getAllMessagesForUser, getMessagesForUser, recordMessageForUser } = require('./db');

//create mysql connection for use when querying messages
var db = mysql.createConnection({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    multipleStatements: true
}
);

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log("mySQL connection established");
})

app.use(express.json());
/** 
* route GET /createdb
* creation of database for use in storing messages
* returns message indication successful initialization of database
*/

app.get('/createdb', (req,res) => {
    
    //executes DB creation 
    createDb(db);

    res.status(200).send("Database Initialized.");
})

/** 
* route GET /getMessage
* retrieves messages for a given userId
*
* :userId - dynamic parameter, retrieval of messages limited to ones sent to the user
* ?senderId - optional route query param, to further limit messages to a single sender
*
* returns userId and an array of message objects from the database
*/
app.get('/getMessage/:userId', (req, res) => {
    
    // user ID will be used to recieve messages between two users when a senderId is specified
    const { userId } = req.params;
    // allow for an optional senderId in the route query
    const senderId = req.query.senderId;

    // return all recent messages for a given user if no sender specified
    if(!senderId) {
        getAllMessagesForUser(db, userId, function(result){
            
            res.status(200).send({
                recipientId: userId,
                data: result
            });

        });
    } 
    // otherwise, only return messages from given sender
    else {
        getMessagesForUser(db, userId, senderId, function(result){
            
            res.status(200).send({
                recipientId: userId,
                data: result
            });
        });
    }

});

/** 
* route POST /sendMessage
* sends messages for a given userId and stores it in the database
*
* :userId - dynamic parameter, specifies the sender of the message
* :recipientId - dynamic parameter, specifies to whom the message will be sent
* message - body parameter containing the text message to be recorded
*
* returns status code indicating successful recording of the message
*/

app.post('/sendMessage/:userId/:recipientId', (req, res) => {

    const { userId, recipientId } = req.params;

    const { message } = req.body;

    if(!message){
        res.status(400).send({
            message: "please write a message."
        });
    } else {
        recordMessageForUser(db, userId, recipientId, message);

        res.status(200).send({
            message: "message recorded."
        });
    }

});

app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
);