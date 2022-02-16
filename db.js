const { Pool } = require("pg");

const pool = new Pool({
    user: "test",
    host: "localhost",
    database: "test",
    password: "test",
    port: 5432,
})

const dbColums = {
    tabeleName: "RiseTest",
    firstName: "firstName",
    lastName: "lastName",
    email: "email",
    phone: "phone",
    password: "password"
}

const execute = async (query) => {
    try{
        await pool.connect();
        await pool.query(query);
        console.log("Database Connected");
    } catch (err) {
        console.log(err.stack);
    }
};

const createTableQuery = `
    Create TABLE IF NOT EXISTS ${dbColums.tabeleName} (
        "id" SERIAL,
        ${dbColums.firstName} VARCHAR(100) NOT NULL,
        ${dbColums.lastName} VARCHAR(100) NOT NULL,
        ${dbColums.email} VARCHAR(50) NOT NULL,
        ${dbColums.phone} VARCHAR(50) NOT NULL,
        ${dbColums.password} VARCHAR(500) NOT NULL,
        "token" VARCHAR(1000),
        PRIMARY KEY ("id")
    );`;
const createTable = () => execute(createTableQuery)
        .then(result => {
            if (result){
                console.log("Table Created")
            }
        })
        .catch((err) => {
            console.log(err);
        })

module.exports = {pool, createTable, dbColums};