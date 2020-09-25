import { useState } from 'react'

export default function EditableSeason(props) {
    const { season, onChange } = props;

    const [ year, setYear ] = useState(season.season);

    const updateYear = e => setYear(e.target.value);

    const handleChange = e => onChange({
        event: e,
        source: season
    });

    return <tr>
        <td>
            <input type="text" name="season" required
                value={year} onChange={updateYear} onBlur={handleChange} />
        </td>
        <td>
            <select name="prog" value={season.prog} onChange={handleChange}>
                {props.programList.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
        </td>
        <td style={{textAlign: "center"}}>
            <input type="checkbox" name="full_time"
                checked={!!season.full_time} onChange={handleChange} />
        </td>
        <td style={{textAlign: "center"}}>
            <input type="checkbox" name="renting"
                checked={!!season.renting} onChange={handleChange} />
        </td>
    </tr>;
}
