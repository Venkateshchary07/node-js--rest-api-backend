const mysql = require("mysql2/promise");

const pool=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'Venkat@1234',
    database:'nodeassignment'
});
module.exports = pool;
