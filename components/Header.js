import Link from 'next/link';

const linkStyle = {
    marginRight: 15
};

const Header = () => (
    <div style={{marginBottom: 20}}>
        <Link href="/">
            <a style={linkStyle}>Home</a>
        </Link>
    </div>
);

export default Header;