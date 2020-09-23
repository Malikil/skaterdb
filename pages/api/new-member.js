import db from '../../db-manager';

export default (req, res) => {
    console.log(req.body);
    // Insert the member, updating an existing member if they're already here
    db.addMember(req.body);
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Location', `/pages/edit/member/${req.body.sscid}`);
    res.end(JSON.stringify({
        sscid: req.body.sscid,
        locations: [
            `/pages/edit/member/${req.body.sscid}`
        ]
    }));
};