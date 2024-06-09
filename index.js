import express, { json } from "express";
import basicAuth from 'express-basic-auth';
import dotenv from "dotenv";
dotenv.config({ path: "Properties.env"});
import {ConnectDB, insertIntoBook, queryBooks, queryBooksEditorCondition, updateBook} from "./database.js"

const port = process.env.PORT;

const server = express();

//Apply Basic Auth to all endpoints
server.use(basicAuth({
    users: { 'admin': 'supersecret', 'dev': 'dev1234'}
}))

server.use(express.json());
// Function --------------------------------------------------------------------
// -----------------------------------------------------------------------------



// CRUD Requests --------------------------------------------------------------------
// -----------------------------------------------------------------------------
//HealthCheck to verify if DB is reachable
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

//Add a single book
server.post("/addBooks", function(req, res) {
    let reqBooks = req.body.books;
    let queriesFinished = 0;
    while(queriesFinished != reqBooks.length) {
        for (var i=0; i < reqBooks.length; i++) {
            var name = reqBooks[i].name;
            if(i == (reqBooks.length-1)) { queriesFinished = true; }
            insertIntoBook(reqBooks[i].name, reqBooks[i].editor, reqBooks[i].author).then((queryResults) => {
                if (queryResults.insertId != null) {
                    queriesFinished ++;
                } else if(queryResults.insertId == null ) {
                    return res.status(500).json({
                        error: true,
                        message: "Insert was not succesful for " + name
                    });
                }
            });
        }
    }
    if (queriesFinished == reqBooks.length) res.send('Success');
    

    // insertIntoBook(bookName, bookEditor, bookAuthor).then((queryResults) => {
    //     if (queryResults.insertId != null) {
    //         res.send("Insert successful!");
    //     } else {
    //         return res.status(500).json({
    //             error: true,
    //             message: "Not possible to run the query"
    //         })
    //     }
    // })
})

server.post("/updateBooks", function(req, res) {
    let reqBooks = req.body.books;
    
    for(var i=0; i < reqBooks.length; i++) {
        console.log("i = " + i);
        updateBook(reqBooks[i].name, reqBooks[i].editor, reqBooks[i].author).then((updateResults) =>{
            if (!updateResults) console.log(reqBooks[i].name + " update was not successful!");
        })
    }

});

server.listen(port, () => {
    console.log("Express server listening on port ", port);
})