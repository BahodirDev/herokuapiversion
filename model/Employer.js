const {Schema,model} = require('mongoose');

const Employer = new Schema({
    login:String,
    fish:
        {
            type:String
        },
    tel:String,
    assign_time:{
        type:Date,
        default: Date.now()
    },
    description:String,
    role:{
        type:Object,
        default:{
            roles:['user']
        }
    },
    password:String
},{timestamps:true})

module.exports = model('employer',Employer)