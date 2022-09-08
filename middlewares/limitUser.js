module.exports = (req,res,next)=>{
    if(req.body.amount >= 100){
        res.json({error:"yuqori miqdor tavsiya etilmaydi"})
    }else{
        next()
    }
}