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
export async function ConnectDB1() {
    var con;
    try {
        con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'teste123',
            database: 'api'
        })

        console.log("Successfully connected");
        return con;
    } catch(err) {
        console.log("NOT Connected");
        return con;
    }
}


export async function ConnectDB() {
    let con;
    try {
        //Get a connection from the pool
        con = await connPool.getConnection();
        console.log("Successfully connected", con);
        return con;
    } catch(err) {
        console.log("NOT Connected");
        return con;
    }
}

//
export async function query1Filter(pool, selector, filter, filterValue) {
    
};

// var con = ConnectDB();
//     con.connect(function(err) {
//         if (err) throw err;
//         con.query('Select ? from books where ? = ?', [selector, filter, filterValue], function(error, results, fields) {
//             console.log(results);
//             return results;
//         });
//     });