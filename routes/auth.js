const {Router} = require('express');
const { JWT_SECRET } = require('../keys/key');
const Employer = require('../model/Employer');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const verifyToken = require('../middlewares/verifyToken');
const withoutAuth = require('../middlewares/withoutAuth');

const router = Router();

router.post('/auth', withoutAuth,(req,res)=>{
    const {login,password} = req.body;
    try {
        if(!login || !password){
            return res.status(401).json({error:"ma`lumotni to`liq kiritng"})
        }else{
            
            Employer.findOne({login:login})
            .then(data=>{        
                if(data){
                    bcrypt.compare(password,data.password)
                    .then(matched=>{
                        if(matched){
                            const token = jwt.sign({_id:data._id},JWT_SECRET);
                            return res.json({token:token,user:{name:data.fish,role:data.role,tel:data.tel}})
                        }else{
                            return res.json({error:"password yoki username xato"})
                        }
                    })
                    }else{
                    return res.json({error:"password yoki username xato"})
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;