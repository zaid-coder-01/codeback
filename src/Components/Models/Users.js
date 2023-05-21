const mongoose=require('mongoose')

const users=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    uname:{
        type:String,
        required:true,
        unique:true
    },
    pass:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mode:{
        type:String,
        required:true,
        default:'normal'
    },
})
const Users=new mongoose.model("Users",users);
module.exports=Users;