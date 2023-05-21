const mongoose=require('mongoose')

const apiCategory=new mongoose.Schema({
    Name:{
        type:String,
        required:true,
        unique:true
    },
    Data:{
        type:String,
        required:true,
        unique:true
    },
})
const AddapiData=new mongoose.model("ApiData",apiCategory);
module.exports=AddapiData;