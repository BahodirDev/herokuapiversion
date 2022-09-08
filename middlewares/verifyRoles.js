const verifyRoles =(...reqRoles)=>{
    return (req,res,next)=>{
        if(!req.roles) return res.status(401);
        const refreshRoles = [...reqRoles];
        console.log(req.roles);
        console.log(refreshRoles);
        const result = req.roles.map(role => refreshRoles.includes(role));
        const fresult = result.find(s=>s === true)
        console.log('fresult', fresult);
        console.log('result', result);
        console.log('ref',refreshRoles);
        if(!fresult || fresult === undefined ){
            return res.status(401).json({error:"Sizga bunday imkoniyat berilmagan"})
        }else{

            next();
        }
    }
}

module.exports = verifyRoles