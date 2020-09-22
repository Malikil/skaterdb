import Link from 'next/link';

const style = {
    margin: '4px',
    padding: '8px',
    border: '1px solid #DDD',
    display: 'inline-block'
}

const MemberTile = props => <div style={style}>
    <Link href={`/edit/member/${props.member.sscid}`}>
        <a>{props.member.sscid}</a>
    </Link><br />
    <b>{props.member.fname} {props.member.lname}</b>
</div>;

export default MemberTile;