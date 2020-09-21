import Layout from '../components/Layout';
import fs from 'fs';
import path from 'path';

export default function Index(props) {
    return (
        <Layout>
            <table style={{
                marginTop: '2em'
            }}>
                <thead>
                    <tr>
                        <th>Reports</th>
                        <th>Add Data</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <ul>
                                {props.reports.map(report => (
                                    <li key={report}>
                                        <a href={`/reports/${report}`}>{report}</a>
                                    </li>
                                ))}
                            </ul>
                        </td>
                        <td>
                            <ul>
                                <li>Nothing here</li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </Layout>
    );
}

export async function getStaticProps() {
    const reportsDir = path.join(process.cwd(), 'pages/reports/');
    const reports = fs.readdirSync(reportsDir).reduce((arr, file) => {
        if (file.endsWith('.js'))
            arr.push(file.slice(0, -3));
        return arr;
    }, []);

    return {
        props: {
            reports
        }
    };
}
