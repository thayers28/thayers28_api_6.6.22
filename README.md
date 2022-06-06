# thayers28_api_6.6.22
this is a sample app to enable the sending and recieving of messages between users

# Installation
this project leverages express.js and mySQL server for the execution of APIs and storage of messages

Install mySQL server using the windows [installer](https://dev.mysql.com/downloads/windows/installer/8.0.html), using default developer options

Create a local MySQL instance to connect to the APIs. The connection details are specified in index.js
```
host: 'localhost',
user: 'root',
password: 'root'
```
note: the default installation of mySQL server may not allow ```root``` as a password, executing the following in a query editor will allow the app to access the local mySQL instance:
```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root'
``` 
from there, clone the repo and navigate to the root dir.
to start the app:
```
npm install
node .
```
confirm the app is running through terminal outputs:
```
it's alive on http://localhost:8000
mySQL connection established
```

# Usage

There are three separate APIs available while the app is running. I tested these using Insomnia but I will be including example curl commands below.

## GET /createdb

Execute this API to instantiate the database and table. This MUST be run before sending/receiving of messages can be attempted. An example can be seen below:
```
curl http://localhost:8000/createdb
```
this request takes no variables and will execute so long as the SQL server is running 

## GET /getMessage/:userId

Execute this API to receive messages for a given user ID. The route includes an optional query parameter for a specific sender's messages to be returned. An example can be seen below:
```
route to return all messages sent to user ID 45
curl http://localhost:8000/getMessage/45

route to return messages sent to user ID 45 from user ID 23
curl http://localhost:8000/getMessage/45?senderId=23
```
The format of the returned data will look like the following:
```
{
	"recipientId": "45",
	"data": [
		{
			"messageLogId": 5,
			"senderId": 23,
			"recipientId": 45,
			"textMessage": "wassup",
			"messageTimestamp": "2022-06-03T02:44:47.000Z"
		},
		{
			"messageLogId": 2,
			"senderId": 25,
			"recipientId": 45,
			"textMessage": "hello there",
			"messageTimestamp": "2022-06-02T23:15:22.000Z"
		}
	]
}
```
The messages are returned as an array of objects, with the recipeient's ID at the top. As per the prompt, up to 100 messages younger than 30 days old will be returned.

## POST /sendMessage/:userId/:recipientId

This API will take a message in the body and write it to the database for a given sender and recipient ID. 
```
curl -X POST -H "Content-Type: application/json" \
    -d '{"message": "Hidey ho, neighborino!"}' \
    http://localhost:8000/sendMessage/45/23
```
Messages sent using this API will be immediately queriable through the GET routes discussed above. the route will recieve one of two responses:
```
if an empty message was sent
status:400
{
	"message": "please write a message."
}

if a valid message was sent
status:200
{
	"message": "message recorded."
}
```

# Improvements/Considerations
Given the time contraints in the prompt, I gravitated toward more comfortable technologies I could stand up reasonably quickly. Express.js provides a well-documented framework on top of node with some neat API functions built-in, so starting and calling the APIs on my local machine was a cinch. Having had the most experience with RDS like mySQL/MSSQL, the community server provided a simple way to read/write data off the APIs.

That said, the app has very limited error handling and testing capabilities, and given more time I would have built these out utilizing ```mocha``` for a more stable and well-developed project. Additionally, my comfort with writing SQL queries was somewhat weighed down by the quirky nature of node's mysql library, and I had to spend a bit of time making sure I could return the actual data packets containing the messages and associated metadata. Many enterprise projects see the use of connection pools and Promisified wrappers to make the queries more straight-forward, but I did not have those tools at my disposal.

Additionally, it may be noted this "chat" is not realtime, but a series of writes to and reads from a database containing the connection between users. This was done as a way to maintain REST-fulness, however for a truly real-time chat, a websocket connection would have been more appropriate.

#Afterword
This was a fun and challenging project given the scope and timeframe. Thank you for your time.
thayers28
