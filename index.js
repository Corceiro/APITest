import express, { json } from "express";
import basicAuth from 'express-basic-auth';
import dotenv from "dotenv";
dotenv.config({ path: "Properties.env"});
import {ConnectDB, insertIntoBook, queryBooks, queryBooksEditorCondition, updateBook} from "./database.js"

const port = process.env.PORT;

const server = express();

//HealthCheck to verify if DB is reachable
//Done before the Basic Auth so it is not needed (as expected for a HealthCheck) 
server.get("/isAlive", function (req,res) {
    ConnectDB().then((valid) => {
        if(valid = true) {
            res.send("Database connected");
        }
        else return res.status(500).json({
            error: true,
            message: "Not possible to connect to DB"
        })
    });
});

//Apply Basic Auth to all endpoints
server.use(basicAuth({
    users: { 'admin': 'supersecret', 'dev': 'dev1234'}
}))

server.use(express.json());
// Function --------------------------------------------------------------------
// -----------------------------------------------------------------------------



// CRUD Requests --------------------------------------------------------------------
// -----------------------------------------------------------------------------
//Get all books (no conditions)
server.get("/getBooks", function(req, res) {
    queryBooks().then((queryResults) => {
        console.log("Query: ", queryResults);
        if (queryResults) {
            res.send(queryResults);
        } else {
            return res.status(500).json({
                error: true,
                message: "Not possible to run the query"
            })
        }
    })
});
//Get all books with Editor condition
server.post("/getEditorBooks", function (req,res) {
    var reqFilterValue = req.body.FilterValue;
    if(reqFilterValue) {
        queryBooksEditorCondition(reqFilterValue).then((queryResult) => {
            console.log("Query: ", queryResult);
            if (queryResult) {
                res.send(queryResult);
            } else {
                return res.status(500).json({
                    error: true,
                    message: "Not possible to run the query"
                });
            }
        });
    } else {
        return res.status(400).json({
            error: true,
            message: "no arguments"
        });
    } 

});
//Add books
//Receives a Json object with books
server.post("/addBooks", function(req, res) {
    let reqBooks = req.body.books;
    let queriesFinished = 0;
    for (var i=0; i < reqBooks.length; i++) {
        var bookName = reqBooks[i].name;
        insertIntoBook(reqBooks[i].name, reqBooks[i].editor, reqBooks[i].author).then((queryResults) => {
            if(queryResults.insertId == null ) {
                return res.status(500).json({
                    error: true,
                    message: "Insert was not succesful for " + bookName
                });
            } else if(queryResults.insertId !=null) {
                console.log(queriesFinished +" | length is - " + (reqBooks.length-1));
                if(queriesFinished == (reqBooks.length-1)) {
                    res.send('Success');
                }
                queriesFinished ++;
            }
        });
    }
})
//Update books table
//Receives a Json object with books
server.post("/updateBooks", function(req, res) {
    let reqBooks = req.body.books;
    let queriesFinished = 0;
    for(var i=0; i < reqBooks.length; i++) {
        var bookName = reqBooks[i].name;
        updateBook(reqBooks[i].name, reqBooks[i].editor, reqBooks[i].author).then((queryResults) => {
            if(queryResults == null) {
                return res.status(500).json({
                    error: true,
                    message: "Update was not successful for " + bookName
                });
            } else if(queryResults != null) {
                console.log(queriesFinished +" | length is - " + (reqBooks.length-1));
                if(queriesFinished == (reqBooks.length-1)) {
                    res.send('Success');
                }
                queriesFinished ++;
            }
        });
    }

})

server.listen(port, () => {
    console.log("Express server listening on port ", port);
})