import mysql from "mysql";

// Functions ---------------------------------------------------

//Database pool
const connPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'teste123',
    database: 'api',
    waitForConnections: true,
    connectionLimit: 3,
    maxIdle: 3,
    queueLimit: 0,
    enableKeepAlive: true
});

// Create Database Connection
export async function ConnectDB() {
    connPool.getConnection(function(err, connection) {
        if(err) {
            throw err;
            return false;
        }
        console.log(connection);
        connection.release();
        return true;
    });
}

//
export async function queryOneCondition(pool, selector, filter, filterValue) {
    return new Promise((resolve, reject) => 
        connPool.query('Select * from books;', function(err, results, fields) {
            if(err) {
                throw err;
                reject(err);
            }
            console.log("Results: ", results);
            resolve(results);
        })    
    );
};

// var con = ConnectDB();
//     con.connect(function(err) {
//         if (err) throw err;
//         con.query('Select ? from books where ? = ?', [selector, filter, filterValue], function(error, results, fields) {
//             console.log(results);
//             return results;
//         });
//     });