const pgp = require('pg-promise')({
    capSQL: true
});

const db = pgp({
    host:     process.env.DB_HOST,
    database: process.env.DB_NAME,
    user:     process.env.DB_USER,
    password: process.env.DB_PASS
});

async function getMembers(year) {
    let result = await db.many(
        'SELECT members.*, season, prog FROM members ' +
        'INNER JOIN memseasons ON memseasons.member = members.sscid ' +
        'WHERE season = 2019'
    );
    return result;
}

export default {
    getMembers
};