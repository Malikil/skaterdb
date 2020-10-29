import Layout from '../../components/Layout';
import { getMembersBySeason, getProgramList } from '../../db-manager';

export default function ReturningMembers(props) {
    
    return <Layout>

    </Layout>
};

export async function getServerSideProps() {
    // 
    const members = await getMembersBySeason();
    const programs = await getProgramList();
    return {
        props: {
            members,
            programs
        }
    }
};