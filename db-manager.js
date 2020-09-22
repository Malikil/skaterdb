const db = require('./pg-connection').instance;

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