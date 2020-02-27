require('dotenv').config();
const readline = require('readline');
const parse = require('csv-parse');
const fs = require('fs');
const pgp = require('pg-promise')({
    capSQL: true
});

const cmd = process.argv.slice(2);
const db = pgp({
    host:     process.env.DB_HOST,
    database: process.env.DB_NAME,
    user:     process.env.DB_USER,
    password: process.env.DB_PASS
});
/**
 * @param {string} csv The filename to parse from
 * @returns {Promise<any[][]>} An array containing each line, as an array
 */
async function parsecsv(csv)
{
    return new Promise((resolve, reject) => {
        var parser = parse((err, records) => {
            if (err)
                reject(err);
            else
                resolve(records);
        });
        fs.createReadStream(csv).pipe(parser);
    });
}
/** @param {string} prompt */
async function getConfirmation(prompt)
{
    const inp = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    let ans;
    while (!["Y", "y", "N", "n"].includes(ans))
        ans = await new Promise(resolve =>
            inp.question(`${prompt} (Y/N) `, a => resolve(a))
        );
    inp.close();
    return ans === 'y' || ans === 'Y';
}

(async () => {
    // If the user asks for help, give them a help message
    if (cmd.length !== 1 || cmd[0] === '?')
        return console.log(
            "The last argument should be the name of the csv file downloaded from google " +
            "sheets.\n" +
            "Make sure it's in the same folder as this script.\n" +
            "eg: node importmeet.js bby_minimeet.csv"
        );
    // Parse the file and get all info from it
    if (!(cmd[0].endsWith('.csv') && fs.existsSync(cmd[0])))
        return console.log(
            `Can't find file ${cmd[0]}. Make sure it's in the same folder as this program, ` +
            "it's a csv file, and that you've included the '.csv' in the cmd parameters."
        );
    let data = await parsecsv(cmd[0]);
    let meetinfo = data.shift();
    console.log(meetinfo);
    // Check for if this meet has happened before
    let foundmeet = await db.oneOrNone("SELECT m.id FROM meets m " +
        "INNER JOIN locations l ON l.id = m.location_id " +
        "WHERE meet_name = $1 AND city = $2 AND rink " +
        (meetinfo[5] ? "= $3" : " IS NULL"),
        [meetinfo[1], meetinfo[3], meetinfo[5]]);
    console.log(foundmeet);
    
    db.tx(async t => {
        let query = "";
        // If the meet doesn't exist, add it here
        if (!foundmeet)
        {
            // Get the location id
            query = "SELECT id FROM locations WHERE city = $1 AND rink " +
                (meetinfo[5] ? "= $2" : "IS NULL");
            rinkid = await t.one(query, [meetinfo[3], meetinfo[5]]);
            if (!rinkid)
                return Promise.reject("Cannot find matching location");
            
            query = "INSERT INTO meets(location_id, meet_name) " +
            "VALUES($1, $2) RETURNING id";
            foundmeet = await t.one(query, [rinkid.id, meetinfo[1]]);
        }
        console.log(foundmeet);
        // Run through the remaining lines and sort into races/results
        let raceids;
        let cols;
        let races = [];
        let results = [];
        let racers = {};
        for (let r = 0; r < data.length; r++)
        {
            let row = data[r];
            if (!raceids)
            {
                // Three cases
                // - Header row
                // - Race row
                // - Header row for results section
                if (isNaN(row[0]))
                {
                    if (!cols)
                    {
                        // This is the first row, prepare the columns the be inserted to
                        row.push('meetid');
                        cols = new pgp.helpers.ColumnSet(row, { table: 'races' });
                    }
                    else
                    {
                        // This is the beginning of the results section
                        // Add the races to the database and get their ids
                        query = pgp.helpers.insert(races, cols) + " RETURNING id, race_number, race_group";
                        raceids = {};
                        (await t.many(query)).forEach(rid =>
                            raceids[`${rid.race_number}${rid.race_group}`] = rid.id);
                        console.log(raceids);
                        // Replace the last three columns with the racer column
                        (row = row.slice(0, -3)).push('racer');
                        cols = new pgp.helpers.ColumnSet(row, { table: 'results' });
                    }
                }
                else
                {
                    // This row has a race in it
                    // Push the meetid to the end, then add it to the races array
                    let current = {};
                    cols.columns.forEach((c, i) => current[c.name] = row[i] || null);
                    current.meetid = foundmeet.id;
                    races.push(current);
                }
            }
            else
            {
                // This is a result row
                row.pop();
                let lname = row.pop();
                let fname = row.pop();
                // Get the racer info
                let current = {};
                cols.columns.forEach((c, i) => current[c.name] = row[i] || null);
                let racerid = racers[`${fname} ${lname}`];
                if (!racerid)
                {
                    // We haven't seen this racer yet, get their id from the database
                    let memid = await t.oneOrNone(
                        "SELECT sscid FROM members WHERE fname = $1 AND lname = $2",
                        [fname, lname]
                    );
                    if (!memid)
                        return Promise.reject(`Couldn't find member ${fname} ${lname}`);
                    racerid = racers[`${fname} ${lname}`] = memid.sscid;
                }
                current.racer = racerid;
                // Replace the race number with race id gotten from database
                current.race = raceids[current.race];
                results.push(current);
            }
        }
        query = pgp.helpers.insert(results, cols);
        t.query(query);
    }).catch(err => {
        console.log("Database rolled back with message:");
        console.log(err);
    }).then(result => {
        console.log("Meet imported successfully with message:");
        console.log(result);
    });
})().catch(err => {
    console.log("Encountered unexpected error:");
    console.log(err);
});
