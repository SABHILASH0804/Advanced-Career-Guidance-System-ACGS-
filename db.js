const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL database:", err);
        process.exit(1); // Exit the process if the connection fails
    }
    console.log("Connected to MySQL database");
});

module.exports = connection;