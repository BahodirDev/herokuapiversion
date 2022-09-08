const order = require("../model/order");
const products = require("../model/products");

module.exports = (req,res,next)=>{
    order.find()
        .then(data=>{
            if(data){
                data.forEach((val)=>{
                    products.findOne({_id:val.product_id})
                        .then(result=>{
                            if(result.amount < val.amount){
                                val.msg = true;
                                val.save()
                            }else{
                                val.msg = false;
                                val.save()
                            }
                        })
                    })
            }
            
                next()
        })
}