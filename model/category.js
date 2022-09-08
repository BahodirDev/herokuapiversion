const {Schema,model} = require('mongoose');

const Category = new Schema({
    cat_name:String,
    
},{timestamps:true})

module.exports = model("category",Category)