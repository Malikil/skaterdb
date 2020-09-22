import Layout from '../../../components/Layout';


export default function EditMember(props) {
    return <Layout>
        <p>Nothing here yet</p>
    </Layout>;
}

export async function getServerSideProps(context) {
    console.log(context.query);
    const { sscid } = context.query;
    // Get member information based on sscid
    // Possibly different based on if we were redirected from the new member page
    return {
        props: {

        }
    }
}