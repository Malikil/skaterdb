import Layout from '../../../components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import db from '../../../db-manager';

export default function NewMember(props) {
    const router = useRouter();
    const [member, setMember] = useState(props.member);

    const handleChange = e =>
        setMember({ ...member, [e.target.name]: e.target.value });
    const checkboxChange = e =>
        setMember({ ...member, [e.target.name]: e.target.checked });

    const handleSubmit = async e => {
        e.preventDefault();
        // Validate data
        let dob = member.dob.split('-');
        dob[1] -= 1; // Someone thought months should be zero indexed but nothing else lmao
        let adding = {
            ...member,
            sscid: parseInt(member.sscid),
            dob: new Date(...dob)
        };
        if (!adding.sscid)
            return alert("SSCID is invalid");
        if (adding.city == "Burnaby")
            delete adding.work_burn;
        if (!adding.notes)
            delete adding.notes;
        if (!adding.phone2)
            delete adding.phone2;
        if (!adding.email)
            delete adding.email;
        // Make request
        try
        {
            const res = await fetch(`http://${process.env.NEXT_PUBLIC_OWN_IP}/api/new-member`, {
                method: 'PUT',
                body: JSON.stringify(adding),
                headers: { 'Content-Type': 'application/json' }
            });
            const json = await res.json();
            if (res.status === 201)
                // Redirect to the member's edit page
                router.push(`/pages/edit/member/${json.sscid}?redirect=true`);
            else
                // Failed to add member
                alert("Couldn't add member, SSCID already exists");
        }
        catch (err)
        {
            console.log(err);
            // Failed to add member, probably by timeout or similar
            alert("Something went wrong internally, member could not be added");
        }
    };

    return <Layout>
        <div>
            <h2>Add New Member</h2>
            <form onSubmit={handleSubmit}>
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
                        value={member.notes} onChange={handleChange} /><br />
                    <div style={{textAlign: "right", fontSize: "70%"}}>
                        {member.notes.length}/100
                    </div>
                </div>
                <br /><br />
                <button type="submit">
                    Add Member
                </button>
            </form>
        </div>
    </Layout>;
};

export async function getServerSideProps(context) {
    const props = {
        member: {
            sscid: '',
            fname: '',
            lname: '',
            address: '',
            city: '',
            post_code: '',
            phone: '',
            phone2: '',
            email: '',
            dob: '',
            gender: '',
            notes: '',
            work_burn: false
        }
    };
    if (context.query.prefill)
    {
        const member = await db.getMemberByID(context.query.prefill);
        if (!member)
            return { props };
        
        let dob = `${member.dob.getFullYear()}-${
            (member.dob.getMonth() < 9 ? '0' : '') + (member.dob.getMonth() + 1)
        }-${(member.dob.getDate() < 10 ? '0' : '') + member.dob.getDate()}`;

        props.member = {
            ...member,
            dob,
            phone2: (member.phone2 || ''),
            email: (member.email || ''),
            notes: (member.notes || '')
        };
    }
    return { props };
};