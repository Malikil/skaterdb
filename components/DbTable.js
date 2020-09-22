const DbTable = props => {
    // Get the key as the first header
    let itemKey = props.headers[0];
    return (
        <table>
            <thead>
                <tr>
                    {props.headers.map(h => <th key={h}>{h}</th>)}
                </tr>
            </thead>
            <tbody>
                {props.data.map(row => (
                    <tr key={row[itemKey]}>
                        {props.headers.map(h => <td key={`${row[itemKey]}${h}`}>{row[h]}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default DbTable;