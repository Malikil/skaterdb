const pgPromise = require('pg-promise');

const pgp = require('pg-promise')({
    capSQL: true
});

// Singleton to avoid multiple connection instances
const DB_KEY = Symbol.for("BSSC.db");
const globalSymbols = Object.getOwnPropertySymbols(global);
const hasDb = (globalSymbols.indexOf(DB_KEY) > -1)

if (!hasDb)
    global[DB_KEY] = pgp({
        host:     process.env.DB_HOST,
        database: process.env.DB_NAME,
        user:     process.env.DB_USER,
        password: process.env.DB_PASS
    });

// Create and freeze the singleton object so that it has an instance property
const singleton = {};
Object.defineProperty(singleton, "instance", {
    get: () => global[DB_KEY]
});
Object.freeze(singleton);

module.exports = singleton;
