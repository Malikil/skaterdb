export default function EditableSeason(props) {
    const { season, onChange } = props;

    const handleChange = e => onChange({
        event: e,
        source: season
    });

    return <tr>
        <td>
            <input type="text" name="season"
                value={season.season} onChange={handleChange} />
        </td>
        <td>
            <input type="text" name="prog"
                value={season.prog} onChange={handleChange} />
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