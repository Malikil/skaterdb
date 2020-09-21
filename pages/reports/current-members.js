import Layout from '../../components/Layout';
import DbTable from '../../components/DbTable';
import db from '../../db-manager';

export default function CurrentMembers(props) {
    return (
        <Layout>
            <h1>Current Members</h1>
            <DbTable headers={props.headers} data={props.members} />
        </Layout>
    );
}

export async function getServerSideProps() {
    let members = await db.getMembers();
    let headers = Object.keys(members[0]);
    return {
        props: {
            members: members.map(m => {
                // DoB should be stringified
                return {
                    ...m,
                    dob: new Intl.DateTimeFormat('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    }).format(m.dob)
                }
            }),
            headers
        }
    };
}