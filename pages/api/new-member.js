import db from '../../db-manager';

export default (req, res) => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Location', `/pages/edit/member/${101054}`);
    res.end(JSON.stringify({
        sscid: 101054,
        locations: [
            `/pages/edit/member/${101054}`
        ]
    }));
};