const DbTable = props => {
    // Get the key as the first header
    let itemKey = props.headers[0];
    return (
        <table>
            <tr>
                {props.headers.map(h => <th key={h}>{h}</th>)}
            </tr>
            {props.data.map(row => (
                <tr key={row[itemKey]}>
                    {props.headers.map(h => <td key={row[h]}>{row[h]}</td>)}
                </tr>
            ))}
        </table>
    );
}

export default DbTable;