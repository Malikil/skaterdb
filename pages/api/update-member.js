import { updateMember } from '../../db-manager';

export default async (req, res) => {
    console.log(req.body.sscid);
    console.log(req.body.member);
    // Update the member and programs
    try
    {
        let result = await updateMember(req.body.member, req.body.sscid);
        if (result.ok)
        {
            res.statusCode = 202;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                
            }));
        }
        else
        {
            res.statusCode = 400;
            res.end();
        }
    }
    catch (err)
    {
        console.log("update-member.js");
        console.log(err);
        res.statusCode = 500;
        res.end();
    }
}