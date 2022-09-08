const {Router} = require('express');
const { ROLES_LIST } = require('../keys/config');
const verifyRoles = require('../middlewares/verifyRoles');
const verifyToken = require('../middlewares/verifyToken');
const category = require('../model/category');


const router = Router() 

router.post("/categoryAdd", verifyToken, verifyRoles(ROLES_LIST.editor,ROLES_LIST.admin),(req,res)=>{
    category.create({
        cat_name:req.body.catName,
    })
    .then(data=>{
        if(data){
        return res.json(data)

        }else{
            return res.status(406).json({error:"Xatolik"})

        }
    })
    .catch(e=>console.log(e))
})

router.get('/getCategory',(req,res)=>{
    category.find()
    .then(data=>{
        if(data){
            return res.json(data)
        }else{
            return res.status(400).json({error:"Xatolik"})
        }
    })
})

router.delete("/remove/:id",  verifyToken, verifyRoles(ROLES_LIST.editor,ROLES_LIST.admin),(req,res)=>{
    
    category.findByIdAndRemove(req.params.id)
        .then(data=>{
            return res.json(data)
        })
})

router.get('/category/:id',(req,res)=>{
    const catId = req.params.id;
    category.findById(catId)
        .then(data=>{
            return res.json(data)
        })
});

router.put("/categoryEdit/:id",  verifyToken, verifyRoles(ROLES_LIST.editor,ROLES_LIST.admin),(req,res)=>{
    const {name} = req.body;
    category.findByIdAndUpdate(req.params.id,{
        $set:{cat_name:name}
    },{new:true})
    .then(data=>{
        if(data){
        return res.json(data)
        }else{
            return res.status(406).json({error:"Xatolik"})
        }
    })
})


module.exports = router