const products = require("../model/products")

module.exports = (arg)=>{
   return products.findOne({_id:arg._id})
        .then(data=>{
            return data
        })
}