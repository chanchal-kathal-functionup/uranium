const mongoose =require("mongoose")
const ObjectId= mongoose.Schema.Types.ObjectId
const reviewSchema= new mongoose.Schema({

        bookId: {type:ObjectId, 
        required:"Book Id is required",
         ref: 'Book'
        },

        reviewedBy: {type:String, 
            required:"reviewedBy is required",
             default:'Guest'
             
            },

         reviewedAt: {type:Date,
            required: true,
            default:Date.now()
            },

        rating: {type:Number,
            minlength: 1,
            maxlength: 5, 
            required:"rating is required"
        },

        review: {type:String, 
           default:0
            },

        isDeleted: {type:Boolean, 
            default: false
        }
        
},   {timestamps:true})

module.exports = mongoose.model("Review",reviewSchema)
