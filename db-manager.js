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
    // Construct the parameter list and values list for optional items
    var paramStr = '';
    var valStr = '';
    var values = [
        member.sscid,
        member.fname,
        member.lname,
        member.address,
        member.city,
        member.post_code,
        member.phone,
        member.dob,
        member.gender
    ];
    [ "phone2", "email", "notes", "work_burn" ].forEach(key => {
        if (member[key])
        {
            paramStr += `, ${key}`;
            values.push(member[key]);
            valStr += `, $${values.length}`;
        }
    });
    // Construct the insert query
    let query = 'INSERT INTO members(sscid, fname, lname, address, city, post_code, phone, dob, gender' +
        `${paramStr}) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9${valStr}) ` +
        "ON CONFLICT ON CONSTRAINT Members_pkey DO UPDATE SET " +
        "fname = $2, lname = $3, address = $4, city = $5, post_code = $6, phone = $7, dob = $8, gender = $9";
    [ "phone2", "email", "notes", "work_burn" ].forEach((key, i) => {
        if (member[key])
            query += `, ${key} = $${i + 10}`;
    });
    query += " WHERE sscid = $1";
    console.log(query);
    //db.query(query, values);
}

async function updateMember(member) {

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
    updateMember,
    getMemberByID
};