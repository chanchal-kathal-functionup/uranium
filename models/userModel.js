const mongoose=require("mongoose")

const userSchema = new mongoose.Schema({
    title:{type:String,
        required:"title is required",
        enum:["Mr","Mrs","Miss"]

    },
    name:{type:String,
        required:"name of user is required"

    },
    phone:{type:String,
        required:"phone of user is required",
        unique:"phone of user should be unique"

    },
    email:{type:String,
        required:"email is required",
        unique:"email should be unique",
        lowercase:true

    },
    password:{ type:String,
        required:"passwords is mandatory",
        minlength:8,
        maxlength:15

    },
    address:{
        street:{type:String},
        city:{type:String},
        pincode:{type:String
        }
    }

},   {timestamps:true})

module.exports=mongoose.model("User",userSchema)