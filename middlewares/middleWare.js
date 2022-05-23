const jwt = require("jsonwebtoken");
const booksModel = require("../models/booksModel");
// const booksModel = require("../models/booksModel");
const validator=require("validator");
const { default: mongoose } = require("mongoose");


const isValidObjectId = function (objectId) {
  //     return /^[0-9a-fA-F]{24}$/.test(objectId)
    return mongoose.Types.ObjectId.isValid(objectId)}
    

const user= async function(req, res, next){
try{
let token = req.headers["x-api-key"];
  if (!token) {
    token = req.headers["x-Api-key"];
  }
  if (!token) {
      //404- not found
    return res.status(404).send({ status: false, message: "token must be present" });
  }

  let decodedtoken = jwt.verify(token, "Group46");
  if (!decodedtoken){
      //400- bad request
    return res.status(400).send({ status: false, message: "token is invalid" });
  }
  next();
}
catch (err) {
   return res.status(500).send({ msg: "Error", message: err.message })
  };
}

// const auth= async function(req,res,next){
//   try{
    
//     const token = req.headers["x-api-key"];
//     decodedtoken=jwt.verify(token,"Group46")
//     let bookId=req.params.bookId
//     const book = await booksModel.findById(bookId)
//     if(!book){
//       return res.status(400).send({status:false,message:"Data for This bookId is not exist"})
//     }
//     if(decodedtoken.userId!=book.userId){
//       return res.status(400).send({status:false,message:"You are not authorized"})
//     }
//     next();
//   }
//   catch(error){
//     return res.status(500).send({status:false,message:error.message})
//   }
// }

const authorization = async function (req, res, next) {
  try {
      let tokenUserId = req.tokenUserId
      let user = req.body.userId
      let user2 = req.params.bookId

      if (user2) {
          // user2 = req.params.userId

          // Checking the inputted bookId valid or not
          if (!isValidObjectId(user2)) {
              return res.status(404).send({ status: false, message: "Book id is not valid" })
          }

          // Finding the bookId from existing db
          let checkBookId = await booksModel.findOne({ _id: user2 })
          if (!checkBookId) {
              return res.status(404).send({ status: false, message: "Book not found" })
          }

          // Selecting userId
          let getUserId = await booksModel.findById({ _id: user2 }).select({ userId: 1 })
          // console.log(getUserId)
          let findUserId = getUserId.userId.toString() //for extrxting id like this - 626ba1610a95a6c52d0b4d0b
          // console.log("For User2: ", findUserId, tokenUserId)
          if (findUserId != tokenUserId) {
              return res.status(401).send({ status: false, message: "User should log in" })
          }

      } else if (user) {
          // console.log("For User1: ", user, tokenUserId)

          // Checking the inputted userId valid or not
          if (!validator.isValidObjectId(user)) {
              return res.status(404).send({ status: false, message: "User id is not valid" })
          }

          // Finding the inputted userId's existance from db
          let uniqueUserId = await userModel.findById({ _id: user })
          if (!uniqueUserId) {
              return res.status(404).send({ status: false, message: "UserId is not exist in our data base" })
          }

          if (user != tokenUserId) {
              return res.status(401).send({ msg: "User must login" })
          }

      }

      next();
  }
  catch (error) {
      console.log("This is an error: ", error.message)
      res.status(500).send({ msg: "Error", error: error.message })
  }
}


 module.exports.user = user;
 module.exports.authorization = authorization