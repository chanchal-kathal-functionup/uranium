const express = require("express");
const booksModel = require("../models/booksModel");
const mongoose = require("mongoose")
const userModel = require("../models/userModel");
const reviewModel = require("../models/reviewModel")
const aws = require("aws-sdk");

aws.config.update({
    accessKeyId: "AKIAY3L35MCRVFM24Q7U",  // id
    secretAccessKey: "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",  // secret password
    region: "ap-south-1"
});


// This function uploads file to AWS and gives back the url for the file
let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {

        let s3 = new aws.S3({ apiVersion: "2006-03-01" });
        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "Sumit/" + file.originalname,
            Body: file.buffer,
        };

        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err });
            }
            return resolve(data.Location);
        });
    });
};
const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "String" && typeof value.trim().length === 0) return false
    return true;
}

const isValidObjectId = function (objectId) {
    //     return /^[0-9a-fA-F]{24}$/.test(objectId)
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const createBook = async function (req, res) {
    try {
        let requestBody = req.body
        const { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = requestBody


        let files = req.files
        if (!files || files.length == 0) {
            return res.status(400).send({ status: false, msg: "No file found" })
        }


        // if(!files){ 
        //    return res.status(400).send({ status : false,  msg: "No file found" })
        // }
        // console.log(files)
        const uploadedFileURL = await uploadFile(files[0])
        

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "invalid request parameter please provide user details" })
        }

        if (!title)
            return res.status(400).send({ status: false, message: "title of Book is required" })

        const duplicatetitle = await booksModel.findOne({ title: title })
        if (duplicatetitle)
            return res.status(400).send({ status: false, message: "This book title is already exist" })

        if (!isValid(excerpt))
            return res.status(400).send({ status: false, message: "excerpt is required" })

        if (!isValid(userId))
            return res.status(400).send({ status: false, message: "userId is required" })

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "UserId is not valid " })
        }

        const validate = await userModel.findById({ _id: userId })
        if (!validate) {
            return res.status(400).send({ status: false, message: "UserId is not found " })
        }


        if (!isValid(ISBN))
            return res.status(400).send({ status: false, message: "ISBN is required" })

        const duplicateISBN = await booksModel.findOne({ ISBN: ISBN })
        if (duplicateISBN)
            return res.status(400).send({ status: false, message: "ISBN is already exist" })


        if (!isValid(category))
            return res.status(400).send({ status: false, message: "category is required" })

        if (!isValid(subcategory))
            return res.status(400).send({ status: false, message: "subcategory is required" })

        //  if(!isValid(reviews))
        //  return res.status(400).send({status:false,message:"reviews is required"})

        //  if(req.user!==userId){
        //  return res.status(400).send({status:false,messege:"you are unauthorised"})
        //  }
        if (!isValid(releasedAt))
            return res.status(400).send({ status: false, message: "releasedAt is required" })

        const FormatReleasedAt = function (releasedAt) {
            return /((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(releasedAt)
        }
        if (!FormatReleasedAt(releasedAt)) {
            return res.status(400).send({ status: false, message: "please provide correct format of released date yyyy/mm//dd" })
        }
        requestBody.booksCover = uploadedFileURL
        const createdBook = await booksModel.create(requestBody)
        return res.status(201).send({ status: true, message: "Book created Successfully", data: createdBook })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const getBooks = async function (req, res) {
    try {
        let data = req.query
        if (data.userId)
            if (!isValidObjectId(data.userId)) {
                return res.status(400).send({ status: false, message: "UserId is not valid " })
            }

        const book = await booksModel.find(data, { isDeleted: false }).select({ subcategory: 0, ISBN: 0, createdAt: 0, updatedAt: 0, __v: 0, deletedAt: 0 }).sort({ "title": 1 });
        if (book.length === 0) {
            return res.status(400).send({ status: false, message: "no data found" })
        }


        return res.status(200).send({ status: true, message: "Book list", data: book })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.messege })
    }
}


// const getBookById = async function(req,res){
//     try{
//         let _id =req.params.bookId
//         const checkBooks= await booksModel.findOne({_id})
//         if(!checkBooks){
//         return res.status(400).send({status:false,message:"This bookId not exist"})
//         }

//         if(checkBooks.isDeleted==true){
//             return res.status(400).send({status:false,message:"This book is already deleted"})
//         }

//             return res.status(200).send({status:true,data:checkBooks})

//     }
//     catch(err){
//         return res.status(500).send({status:false,message:err.messege})
//     }
// }

const getBooksById = async function (req, res) {
    try {
        const id = req.params.bookId
        if (Object.keys(id) == 0) {
            return res.status(400).send({ status: false, message: "Please Provide bookId in path params" })
        }
        if (!isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "Book Id is not valid " })
        }

        const getBook = await booksModel.findById(id).select({ ISBN: 0 })
        if (!getBook) {
            return res.status(404).send({ status: false, message: "no book exist with this id" })
        }
        if (getBook.isDeleted == true) {
            return res.status(404).send({ status: false, message: "Book is already Deleted" })
        }
        const reviewData = await reviewModel.find({ bookId: id, isDeleted: false })
            .select({ bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

        const newData = {
            _id: getBook._id,
            title: getBook.title,
            excerpt: getBook.excerpt,
            userId: getBook.userId,
            category: getBook.category,
            subcategory: getBook.subcategory,
            reviews: getBook.reviews,
            isDeleted: getBook.isDeleted,
            deletedAt: getBook.deletedAt,
            releasedAt: getBook.releasedAt,
            reviewsData: reviewData
        }

        return res.status(200).send({ status: true, message: 'Books list', data: newData })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const updateBooks = async function (req, res) {
    try {
        let data = req.body;
        let id = req.params.bookId

        if (!isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "Book Id is not valid " })
        }

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Invalid request parameter,please provide parameter to update" })
        }

        const checkBookId = await booksModel.findById(id)
        if (!checkBookId) {
            return res.status(404).send({ status: false, message: "This book Id is not exist" })
        }

        /*....................duplication......................*/

        const duplicateISBN = await booksModel.findOne({ ISBN: data.ISBN })
        if (duplicateISBN) {
            return res.status(409).send({ status: false, message: "this ISBN is already exist please use different ISBN " })
        }
        const duplicatetitle = await booksModel.findOne({ title: data.title })
        if (duplicatetitle) {
            return res.status(409).send({ status: false, message: "This book title is already exist please use different title" })
        }

        if (checkBookId.isDeleted == true) {
            return res.status(400).send({ status: false, message: "this book is already deleted" })
        }
        const updatedBooks = await booksModel.findOneAndUpdate({ _id: id }, { $set: { title: data.title, excerpt: data.excerpt, releasedAt: data.releasedAt, ISBN: data.ISBN } }, { new: true })
        return res.status(200).send({ status: true, message: "Success", data: updatedBooks })

    }
    catch (error) {
        return res.status(500).send({ status: false, messege: error.messege })
    }
}

const deleteBookByid = async function (req, res) {
    try {
        let id = req.params.bookId

        if (!isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "Book Id is not valid " })
        }

        // authroization for check the user is authrorized to delete blog or not only user can delete his own book

        const checkBookId = await booksModel.findOne({ _id: id, isDeleted: false });
        if (!checkBookId) {
            res.status(404).send({ status: false, message: "book does not exist " });
        }
        if (checkBookId.isDeleted == true) {
            return res.status(400).send({ status: false, message: "Book is already deleted" })
        }


        let deleteBook = await booksModel.findOneAndUpdate({ _id: req.params.bookId }, { isDeleted: true, deletedAt: new Date() }, { new: true });
        res.status(200).send({ status: true, message: "sucessfully deleted", data: deleteBook });

    } catch (error) {

        res.status(500).send({ status: false, message: error.message });
    }
}

module.exports.createBook = createBook;
module.exports.getBooks = getBooks;
module.exports.getBooksById = getBooksById;
module.exports.deleteBookByid = deleteBookByid;
module.exports.updateBooks = updateBooks;