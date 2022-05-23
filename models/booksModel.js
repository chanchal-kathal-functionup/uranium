const mongoose=require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const booksSchema =new mongoose.Schema({
            title:{ type:String,
                  required:"title is required",
                  unique:"title should be unique"
       },
            excerpt: {type:String, 
                  required:"the excerpt is required"
            }, 
            userId:{type:ObjectId,
                  required: "user Id is mandatory",
                  ref: 'User'
                  },
            ISBN: {type:String, 
                  required:"ISBN is required",
                  unique:"ISBN should be unique"
                  },
            category: {type: String, 
                  required:"category is required"
            },
            subcategory: {type:String,
                  required: "subcategory is required"
            },
            reviews: {type:Number, 
                  default: 0, 
                  comment: "Holds number of reviews of this book"
            },
            deletedAt: {type:Date ,  
                trim:true  },  
                    
            isDeleted: {type:Boolean, 
                  default: false
            },
             releasedAt: {type:String,
              required:true
            },
             booksCover:{type:String}
            
       
},         {timestamps:true})

module.exports=mongoose.model("Book",booksSchema)