import Layout from '../../components/Layout';
import Link from 'next/link';
import db from '../../db-manager';
import MemberTile from '../../components/MemberTile';
import { useCallback, useState } from 'react';

export default function EditMember(props) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(props.members);

    const onChange = useCallback(event => {
        const query = event.target.value;
        setQuery(query);
        if (query.length)
        {
            // Split query by space, each item should match some substring of the name
            let queryArr = query.toLowerCase().split(' ');
            // Filter the array
            setResults(props.members.filter(m => {
                let searchable = `${m.fname} ${m.lname} ${m.sscid}`.toLowerCase();
                return queryArr.every(q => searchable.includes(q));
            }));
        }
        else
            setResults(props.members);
    });

    return <Layout>
        <input type='text' onChange={onChange} value={query} placeholder="Filter members" />
        <div style={{marginTop: 16, marginBottom: 16}}>
            {results.map(m => <MemberTile key={m.sscid} member={m} />)}
        </div>
        <Link href='/edit/member/new'>
            <input type='button' value='Add New Member' />
        </Link>
    </Layout>
};

export async function getServerSideProps() {
    let members = await db.getMembers();
    return {
        props: {
            members: members.map(m => ({
                fname: m.fname,
                lname: m.lname,
                sscid: m.sscid
            }))
        }
    };
};