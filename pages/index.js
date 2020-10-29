import Layout from '../components/Layout';
import Link from 'next/link';
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
                        <th>Add/Edit Data</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{verticalAlign: 'top'}}>
                            <ul>
                                {props.reports.map(report => (
                                    <li key={report}>
                                        <Link href={`/reports/${report}`}>
                                            <a>{report}</a>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </td>
                        <td style={{verticalAlign: 'top'}}>
                            <ul>
                                {props.edits.map(edit => (
                                    <li key={edit}>
                                        <Link href={`/edit/${edit}`}>
                                            <a>{edit}</a>
                                        </Link>
                                    </li>
                                ))}
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

    const editsDir = path.join(process.cwd(), 'pages/edit/');
    const edits = fs.readdirSync(editsDir).reduce((arr, file) => {
        if (file.endsWith('.js'))
            arr.push(file.slice(0, -3));
        return arr;
    }, []);

    return {
        props: {
            reports,
            edits
        }
    };
}
