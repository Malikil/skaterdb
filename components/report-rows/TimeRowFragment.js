import { Fragment } from 'react';

const tdStyle = {
    verticalAlign: "middle"
};

export default function TimeRowFragment(props) {
    return (
        <>
        {props.times.map(distance => (
            <Fragment key={distance.time}>
                <td style={tdStyle}>{distance.time}</td>
                <td>{distance.where}<br />{distance.when}</td>
            </Fragment>
        ))}
        </>
    );
};