const { Schema, model } = require("mongoose");

const Report = new Schema({
  product_id: {
    type:Schema.Types.ObjectId,
    ref:"products"
  },
  amount: Number,
  sale_price: Number,
  postedBy: {
    type:Schema.Types.ObjectId,
    ref:"employer"
  },
  name:String,
  category:String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
},{timestamps:true});
module.exports = model("report", Report);
