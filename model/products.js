const {Schema,model} = require('mongoose');

const Products = new Schema({
    cat_id:String,
    name:String,
    amount:Number,
    orginal_price:Number,
    sale_price:Number,
    deadLine: String,
    postedBy:{
        type:Schema.Types.ObjectId,
        ref:'employer'
    },
    description:String,
    craeted_at:{
        type:Date,
        default:new Date().toISOString()
    },
    updated_at:{
        type:Date,
        default:Date.now()
    }
},{timestamps:true})

module.exports = model('products',Products)