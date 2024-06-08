import express from "express";
import basicAuth from 'express-basic-auth';
import dotenv from "dotenv";
dotenv.config({ path: "Properties.env"});
import {ConnectDB, queryOneCondition} from "./database.js"

const port = process.env.PORT;

const server = express();

//Apply Basic Auth to all endpoints
server.use(basicAuth({
    users: { 'admin': 'supersecret', 'dev': 'dev1234'}
}))

server.use(express.json());
// Function --------------------------------------------------------------------
// -----------------------------------------------------------------------------



// Requests --------------------------------------------------------------------
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

server.post("/getBooks", function (req,res) {

    var reqSelector = req.body.Selector;
    var reqFilter = req.body.Filter;
    var reqFilterValue = req.body.FilterValue;

    if( reqSelector && reqFilter && reqFilterValue) {
        queryOneCondition(reqSelector, reqFilter, reqFilterValue).then((queryResult) => {
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

server.listen(port, () => {
    console.log("Express server listening on port ", port);
})