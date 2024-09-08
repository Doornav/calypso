const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "kavitha001",
    host: "localhost",
    port: "5433",
    database: "calypso"
})

module.exports = pool;