import Layout from '../components/Layout';

const Index = props => (
    <Layout>
        <h1>Reports</h1>
        <ul>
            {props.shows.map(show => (
                <li key={show.id}>
                    <a href={`/p/${show.id}`}>{show.name}</a>
                </li>
            ))}
        </ul>
    </Layout>
);

export default Index;