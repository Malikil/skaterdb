import db from '../../db-manager';

export default async (req, res) => {
    // Insert the member
    let added = await db.addMember(req.body);
    if (added[0])
    {
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Location', `/pages/edit/member/${req.body.sscid}`);
        res.end(JSON.stringify({
            sscid: req.body.sscid,
            locations: [
                `/pages/edit/member/${req.body.sscid}`
            ]
        }));
    }
    else
    {
        res.statusCode = 409;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            conflict: "Member already exists"
        }));
    }
};