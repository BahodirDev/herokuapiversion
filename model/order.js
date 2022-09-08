const {Schema,model} = require('mongoose');

const Order = new Schema({
    product_id:
        {
            type:Schema.Types.ObjectId,
            ref:'products'
        },
    amount:Number,
    sale_price:Number,
    msg:{
        type:String,
        default:false
    },
    posetdBy:{
        type:Schema.Types.ObjectId,
        ref:"employer"
    }
},{timestamps:true});
module.exports = model("order",Order);