import { instance as db } from './pg-connection';

async function getMembers() {
    let result = await db.many(
        'SELECT * FROM members'
    );
    return result;
}

export default {
    getMembers
};