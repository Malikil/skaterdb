import TimeRowFragment from './TimeRowFragment';
import { ageClass } from '../../helpers';

const tdStyle = {
    verticalAlign: "middle"
};

export default function PersonalBestRow(props) {
    // calculate the skater's age on Jul 1
    let now = new Date();
    let age = Math.floor(
        (new Date(now.getFullYear(), 6, 1) - new Date(props.skater.dob)) /
        (1000 * 60 * 60 * 24 * 365.25)
    );
    return (
        <>
            <tr>
                <td colSpan="2" style={tdStyle}><h2>{props.skater.fname} {props.skater.lname}</h2></td>
                <td style={tdStyle}>This Year:</td>
                <TimeRowFragment times={props.skater.current_times} />
            </tr>
            <tr>
                <td style={tdStyle}>{props.skater.sscid}</td>
                <td style={tdStyle}>{props.skater.dob}</td>
                <td style={tdStyle}>Last Year:</td>
                <TimeRowFragment times={props.skater.previous_times} />
            </tr>
            <tr>
                <td style={tdStyle}>{age}</td>
                <td style={tdStyle}>{ageClass(age)}</td>
                <td style={tdStyle}>Previous:</td>
                <TimeRowFragment times={props.skater.old_times} />
            </tr>
        </>
    );
};