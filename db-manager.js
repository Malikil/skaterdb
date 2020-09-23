import { instance as db } from './pg-connection';

// ============================== Members ==============================
async function getMembers() {
    let result = await db.many(
        'SELECT * FROM members'
    );
    return result;
}

/**
 * @param {{
 *  sscid: number,
 *  fname: string,
 *  lname: string,
 *  address: string,
 *  city: string,
 *  post_code: string,
 *  phone: string,
 *  phone2?: string,
 *  email?: string,
 *  dob: Date,
 *  gender: "M"|"F",
 *  notes?: string,
 *  work_burn?: boolean
 * }} member 
 */
async function addMember(member) {
    let query = 'INSERT INTO members(sscid, fname, lname, address, city, post_code, phone, dob, gender' +
        
        ') VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
    db.query(query, [
        member.sscid,
        member.fname,
        member.lname,
        member.address,
        member.city,
        member.post_code,
        member.phone,
        member.dob,
        member.gender
    ]);
}

/**
 * @param {number} sscid 
 */
async function getMemberByID(sscid) {
    let query = `SELECT members.*, json_agg(json_build_object(
        'season', season,
        'prog', prog,
        'full_time', full_time,
        'renting', renting
    )) AS seasons FROM members
    INNER JOIN memseasons ms ON ms.member = members.sscid
    WHERE sscid = $1 GROUP BY
        sscid, fname, lname, address, city, post_code,
        phone, phone2, email, dob, gender, notes, work_burn`;

    let result = await db.oneOrNone(query, [sscid]);
    return result;
}

export default {
    getMembers,
    addMember,
    getMemberByID
};