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
        "ON CONFLICT ON CONSTRAINT members_pkey DO NOTHING RETURNING sscid";
    return db.query(query, values);
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
 *  gender: string,
 *  notes?: string,
 *  work_burn?: boolean,
 *  seasons: {
 *      season: number,
 *      prog: string,
 *      full_time: boolean,
 *      renting: boolean
 *  }[]
 * }} member 
 * @param {number} oldid
 */
async function updateMember(member, oldid) {
    // Make sure the member info itself is updated
    // Update programs for the member
}

// ============================== Programs ==============================
async function getProgramList() {
    let result = await db.many("SELECT * FROM programs");
    return result.map(p => p.pr_name);
}

export default {
    getMembers,
    addMember,
    updateMember,
    getMemberByID,
    getProgramList
};