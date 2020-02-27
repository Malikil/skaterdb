const pgp = require('pg-promise')({
    capSQL: true
});

const db = pgp({
    host:     process.env.DB_HOST,
    database: process.env.DB_NAME,
    user:     process.env.DB_USER,
    password: process.env.DB_PASS
});

module.exports = {

}