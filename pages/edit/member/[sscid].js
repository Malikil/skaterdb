import Layout from '../../../components/Layout';
import { getMemberByID, getProgramList } from '../../../db-manager';
import { useState } from 'react';
import EditableSeason from '../../../components/EditableSeason';
import Error from 'next/error';
import Link from 'next/link';

export default function EditMember(props) {
    // If the member wasn't found, return an error
    if (!props.member)
        return <Error statusCode={404} />;

    const [member, setMember] = useState(props.member);
    const [updated, setUpdate] = useState("Update Member");

    const handleChange = e => {
        setMember({ ...member, [e.target.name]: e.target.value });
        setUpdate("Update Member");
    }

    const checkboxChange = e => {
        setMember({ ...member, [e.target.name]: e.target.checked });
        setUpdate("Update Member");
    }

    const updateSeason = e => {
        // Find the season to update
        setMember({
            ...member,
            seasons: member.seasons.map(s => {
                // Only make changes if this is the season that got changed
                if (s.season == e.source.season)
                    return {
                        ...s,
                        [e.event.target.name]: (
                            e.event.target.type == "checkbox" ?
                            e.event.target.checked :
                            e.event.target.value
                        )
                    };
                else
                    return s;
            }).sort((a, b) => b.season - a.season)
        });
        setUpdate("Update Member");
    }

    const addSeason = () => {
        setMember({
            ...member,
            seasons: [
                ...member.seasons,
                {
                    season: '',
                    prog: props.programs[0],
                    full_time: false,
                    renting: false
                }
            ]
        });
        setUpdate("Update Member");
    }

    const handleSubmit = async e => {
        e.preventDefault();
        // Validate data
        let dob = member.dob.split('-');
        dob[1] -= 1; // Someone thought months should be zero indexed but nothing else lmao
        let updating = {
            ...member,
            sscid: parseInt(member.sscid),
            dob: new Date(...dob),
            seasons: member.seasons.map(season => ({
                ...season,
                season: parseInt(season.season),
            }))
        };
        if (!updating.sscid || updating.seasons.find(s => !s.seasons))
            return alert("SSCID is invalid");
        if (updating.city == "Burnaby")
            delete updating.work_burn;
        if (!updating.notes)
            delete updating.notes;
        if (!updating.phone2)
            delete updating.phone2;
        if (!updating.email)
            delete updating.email;
        // Make request
        try
        {
            let result = await fetch(`http://${process.env.NEXT_PUBLIC_OWN_IP}/api/update-member`, {
                method: 'POST',
                body: JSON.stringify({
                    sscid: props.member.sscid,
                    member: updating
                }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (result.status === 202)
                setUpdate("Updated!");
            else
            {
                alert("Something went wrong internally, member could not be updated");
                console.log(result);
            }
        }
        catch (err)
        {
            console.log(err);
            alert("Something went wrong internally, member could not be updated");
        }
    };

    const tableStyle = {
        paddingRight: "2em",
        verticalAlign: "top"
    };
    
    return <Layout>
        <h2>Edit Member</h2>
        <form onSubmit={handleSubmit}>
            <table>
                <tbody>
                    <tr>
                        <td style={tableStyle}>
                            <input type="text"
                                id="sscid" name="sscid" placeholder="SSCID" size="15"
                                value={member.sscid} onChange={handleChange} required />&nbsp;
                            <input type="text"
                                id="fname" name="fname" placeholder="First name" maxLength="50"
                                value={member.fname} onChange={handleChange} required />&nbsp;
                            <input type="text"
                                id="lname" name="lname" placeholder="Last name" maxLength="50"
                                value={member.lname} onChange={handleChange} required />
                            <br /><br />
                            
                            <input type="text"
                                id="address" name="address" placeholder="Address" size="45" maxLength="75"
                                value={member.address} onChange={handleChange} required />&nbsp;
                            <input type="text"
                                id="city" name="city" placeholder="City" size="15" maxLength="25"
                                value={member.city} onChange={handleChange} required />
                            <div style={{margin: "1ex"}}></div>
                            <input type="text"
                                id="post_code" name="post_code" placeholder="Postal code" size="9" maxLength="7"
                                value={member.post_code} onChange={handleChange} required />&nbsp;
                            <input type="tel"
                                id="phone" name="phone" placeholder="Phone number" size="23" maxLength="12"
                                value={member.phone} onChange={handleChange} required />&nbsp;
                            <input type="tel"
                                id="phone2" name="phone2" placeholder="Alternate phone" size="23" maxLength="12"
                                value={member.phone2} onChange={handleChange} />
                            <br /><br />

                            <input type="email"
                                id="email" name="email" placeholder="Email" size="55" maxLength="75"
                                value={member.email} onChange={handleChange} />&nbsp;
                            <input type="text"
                                id="gender" name="gender" placeholder="Gender" size="5" maxLength="1"
                                value={member.gender} onChange={handleChange} required />
                            <br /><br />

                            <label htmlFor="dob">Date of birth: </label>
                            <input type="date" id="dob" name="dob"
                                value={member.dob} onChange={handleChange} required /><br />
                            <label htmlFor="work_burn">Works in Burnaby: </label>
                            <input type="checkbox" id="work_burn" name="work_burn"
                                checked={!!member.work_burn} onChange={checkboxChange} /><br />
                            <div style={{display: "inline-block"}}>
                                <label htmlFor="notes">Notes: </label><br />
                                <textarea id="notes" name="notes" rows="5" cols="20" maxLength="100"
                                    value={member.notes || ''} onChange={handleChange} /><br />
                                <div style={{textAlign: "right", fontSize: "70%"}}>
                                    {(member.notes || '').length}/100
                                </div>
                            </div>
                            <br /><br />
                            <button type="submit">{updated}</button>&emsp;
                            <Link href={`/edit/member/new?prefill=${member.sscid}`}>
                                <button type="button">Duplicate Member</button>
                            </Link>
                        </td>
                        <td style={tableStyle}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Season</th>
                                        <th>Program</th>
                                        <th style={{paddingRight: "1ex", paddingLeft: "1ex"}}>Full Time</th>
                                        <th style={{paddingRight: "1ex", paddingLeft: "1ex"}}>Renting</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {member.seasons.map(season =>
                                        <EditableSeason key={season.season}
                                            season={season} programList={props.programs}
                                            onChange={updateSeason} />)}
                                </tbody>
                            </table>
                            <br />
                            <button type="button" onClick={addSeason}>Add Season</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    </Layout>;
};

export async function getServerSideProps(context) {
    const { sscid } = context.query;
    // Get member information based on sscid
    const member = await getMemberByID(parseInt(sscid));
    // Make sure the member exists, otherwise the page should be a 404
    if (!member)
        return { props: {} };
    // Get a list of available programs
    const programs = await getProgramList();
    // Possibly different based on if we were redirected from the new member page /shrug
    // Construct the date string so it can be used by the date picker element
    let dob = `${member.dob.getFullYear()}-${
        (member.dob.getMonth() < 9 ? '0' : '') + (member.dob.getMonth() + 1)
    }-${(member.dob.getDate() < 10 ? '0' : '') + member.dob.getDate()}`;
    return {
        props: {
            member: {
                ...member,
                dob
            },
            programs,
            redirect: !!context.query.redirect
        }
    };
};