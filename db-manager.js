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

export default {
    getMembers,
    addMember
};