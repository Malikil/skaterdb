import { instance as db } from './pg-connection';

// ============================== Members ==============================
export async function getMembers() {
    let result = await db.many(
        'SELECT * FROM members'
    );
    return result;
}

export async function getMembersBySeason(season) {
    let query = `SELECT * FROM members
        INNER JOIN memseasons ms ON ms.member = members.sscid
        WHERE ms.season = $1`;
    let result = await db.many(query, [season]);
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
export async function addMember(member) {
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
export async function getMemberByID(sscid) {
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
 *      full_time?: boolean,
 *      renting?: boolean
 *  }[]
 * }} member 
 * @param {number} oldid
 */
export async function updateMember(member, oldid) {
    return db.tx(async t => {
        // Update the member info using the old id
        var queryStr = '';
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
                values.push(member[key]);
                queryStr += `, ${key} = $${values.length}`;
            }
        });
        // Construct the query for member
        values.push(oldid);
        let query = 'UPDATE TABLE members SET sscid = $1, fname = $2, lname = $3, address = $4, ' +
            `city = $5, post_code = $6, phone = $7, dob = $8, gender = $9, ${queryStr}` +
            `WHERE sscid = $${values.length}`;
        await t.query(query, values);

        // Update seasons
        // A new season could be added, a season could be removed, or a season could be updated
        // I'm thinking get a list of current seasons, then make a list of matches and non-matches
        // The matches can then be updated, and non-matches can be added/removed. A season should be
        // removed if the year is removed
        let currentSeasons = await t.query('SELECT season FROM memseasons WHERE member = $1', [oldid]);
        let matching = [];
        let removing = [];
        // The seasons on this list are the ones from the database. Any matching years should be updated,
        // any non-matching years should be removed
        currentSeasons.forEach(s => {
            let existing = member.seasons.find(olds => olds.season == s.season);
            if (existing)
                matching.push(existing);
            else
                removing.push(s.season);
        });
        let adding = member.seasons.filter(updatedSeason =>
            !matching.find(match => match.season == updatedSeason.season)
        );
        let queryResults = {};
        // Matches can be updated as-is
        query = "UPDATE TABLE memseasons SET member = $1, prog = $2, full_time = $3, " +
            "renting = $4 WHERE member = $5";
        queryResults.updated = matching.map(season =>
            t.query(query, [
                member.sscid,
                season.prog,
                season.full_time,
                season.renting,
                oldid
            ])
        );
        // Remove the old seasons
        if (removing.length > 0)
            queryResults.removed = t.query("DELETE FROM memseasons WHERE member = $1 AND season IN $2", [oldid, removing]);
        // Add the new seasons
        query = "INSERT INTO memseasons(member, season, prog, full_time, renting) " +
            "VALUES ($1, $2, $3, $4, $5)";
        queryResults.added = adding.map(season =>
            t.query(query, [
                member.sscid, season.season, season.prog, season.full_time, season.renting
            ])
        );
        // What kind of result to return?
        return queryResults;
    }).then(result => {
        return {
            ok: true,
            result
        };
    }, err => {
        return {
            ok: false,
            result: err
        };
    });
}

// ============================== Programs ==============================
export async function getProgramList() {
    let result = await db.many("SELECT * FROM programs");
    return result.map(p => p.pr_name);
}

/*export default {
    getMembers,
    getMembersBySeason,
    addMember,
    updateMember,
    getMemberByID,
    getProgramList
};*/