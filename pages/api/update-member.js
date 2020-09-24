import db from '../../db-manager';

export default async (req, res) => {
    // Update the member
    // Update programs
    console.log(req.body);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        
    }));
}