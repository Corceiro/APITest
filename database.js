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
        if(err) throw err;
        console.log(connection);
        connection.release();
        return true;
    });
}

//Query Books
export async function queryBooks() {
    return new Promise((resolve, reject) =>
        connPool.query("Select * from books", function(err, results, fields) {
            if(err) {
                throw err;
                reject (err);
            }
            console.log("Rsults: ", results);
            resolve(results);
        })
    );
}

//Query Books with Editor condition
export async function queryBooksEditorCondition(filterValue) {
    var sql = 'Select * from books where editor = ?';
    var inserts = [filterValue];
    sql = mysql.format(sql, inserts);

    console.log(sql);
    
    return new Promise((resolve, reject) => 
        connPool.query(sql, function(err, results, fields) {
            if(err) throw err;
            console.log("Results: ", results);
            resolve(results);
        })    
    );
};

//Insert
export async function insertIntoBook(bookName, bookEditor, bookAuthor) {
    var sql = 'insert into books (title, editor, author) values (?,?,?)';
    var inserts = [bookName, bookEditor, bookAuthor];
    sql = mysql.format(sql, inserts);

    console.log(sql);

    return new Promise((resolve, reject) =>
        connPool.query(sql, function(err, results, fields) {
            if(err) throw err;
            console.log("Result - ", results);
            resolve(results);
        })
    );
}

export async function updateBook(bookName, bookEditor, bookAuthor) {
    var sql = 'update books set title = ?, editor = ?, author = ? where title = ?;';
    var inserts = [bookName, bookEditor, bookAuthor, bookName];
    sql = mysql.format(sql, inserts);

    console.log(sql);

    return new Promise((resolve, reject) =>
        connPool.query(sql, function(err, results, fields) {
            if(err) throw err;
            console.log("Result - ", results);
            resolve(results);
        })
    );
}