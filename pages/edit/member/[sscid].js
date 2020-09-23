import Layout from '../../../components/Layout';
import db from '../../../db-manager';
import { useState } from 'react';

export default function EditMember(props) {
    const [member, setMember] = useState(props.member);

    const handleChange = e =>
        setMember({ ...member, [e.target.name]: e.target.value });

    const tableStyle = {
        paddingLeft: "1ex",
        paddingRight: "1em",
        verticalAlign: "top"
    };
    
    return <Layout>
        <h2>Edit Member</h2>
        <table>
            <tbody>
                <tr>
                    <td style={tableStyle}>
                        <form>
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
                                value={!!member.work_burn} onChange={handleChange} /><br />
                            <div style={{display: "inline-block"}}>
                                <label htmlFor="notes">Notes: </label><br />
                                <textarea id="notes" name="notes" rows="5" cols="20" maxLength="100"
                                    value={member.notes || ''} onChange={handleChange} /><br />
                                <div style={{textAlign: "right", fontSize: "70%"}}>
                                    {(member.notes || '').length}/100
                                </div>
                            </div>
                            <br /><br />
                            <button type="button">Update Member</button>
                        </form>
                    </td>
                    <td style={tableStyle}>
                        Seasons will go here
                        <br /><br />
                        <button>Add Season</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </Layout>;
}

export async function getServerSideProps(context) {
    console.log(context.query);
    const { sscid } = context.query;
    // Get member information based on sscid
    const member = await db.getMemberByID(parseInt(sscid));
    // Possibly different based on if we were redirected from the new member page /shrug
    // Construct the date string so it can be used by the date picker element
    let dob = `${member.dob.getFullYear()}-${
        (member.dob.getMonth() < 9 ? '0' : '') + (member.dob.getMonth() + 1)
    }-${member.dob.getDate()}`;
    return {
        props: {
            member: {
                ...member,
                dob
            },
            redirect: !!context.query.redirect
        }
    };
}