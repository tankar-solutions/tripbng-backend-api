import mongoose from "mongoose";


const PanCardSchema = mongoose.Schema({

title:{
    type:String,
    required:true,
    enum:['mr' ,'mrs']
},
fullname:{
    type:String,
    required:true
},
dob:{
    type:String,
    required:true
},
panNumber:{
    type:String,
    required:true,
    uniqe:true
}

},{ timestamps :true })


export const PanCard = mongoose.model('PanCard' , PanCardSchema)