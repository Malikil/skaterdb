import db from '../../db-manager';

export default async (req, res) => {
    console.log("Original:");
    console.log(req.body.original);
    console.log("Updated:");
    console.log(req.body.updated);
    // Update the member and programs
    res.statusCode = 202;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        
    }));
}