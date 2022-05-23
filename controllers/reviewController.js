const reviewModel = require("../models/reviewModel")
//const validator=require("validator")
const booksModel = require("../models/booksModel")
const mongoose = require("mongoose")

const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "String" && typeof value.trim().length === 0) return false
    return true;
}
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const createReview = async function (req, res) {
    try {
        let requestBody = req.body

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Invalid request parameter, please provide  some data inside body" })
        }
        const { review, rating } = requestBody

        let id = req.params.bookId

        if (!isValidObjectId(id)) {
            return res.status(400).send({ status: false, msg: 'Please provide a valid Book Id' })
        }

        const checkbookId = await booksModel.findById({ _id: id },)
        if (!checkbookId) {
            return res.status(400).send({ status: false, message: " This BookId does  not exist " })
        }

        if (checkbookId.isDeleted == true) { return res.status(404).send({ status: false, msg: 'Book is deleted, unable to find book' }) }

        if (!isValid(rating)) {
            return res.status(404).send({ status: false, message: " rating is required " })
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).send({ status: false, message: "rating should be between 1 to 5" })
        }

        // if(!isValid(reviewedBy)){
        //     return res.status(400).send({status:false,message:" reviewedBy is required "})
        //    }
        requestBody.bookId = id;

        const createdReview = await reviewModel.create(requestBody)
        const updateBookreview = await booksModel.findOneAndUpdate({ _id: id }, { $inc: { reviews: +1 } }, { new: true })
        return res.status(201).send({ status: true, messege: "Success", data: { createdReview, ...updateBookreview.toObject() } })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}

const updateBookReview = async function (req, res) {
    try {
        let data = req.body
        let bookId = req.params.bookId
        if (!bookId) {
            return res.status(400).send({ status: false, message: "please provide book Id in query" })
        }
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: 'Please provide a valid Book Id' })
        }

        const  findbook = await booksModel.findById({ _id: bookId })
        if (!findbook) {
            return res.status(400).send({ status: false, message: "This book Id is not exist or Deleted" })
        }
        if(findbook.isDeleted==true){
            return res.status(400).send({status:false,message:"Book is already Deleted"})
        }
        let reviewId = req.params.reviewId
        if (!reviewId)
            return res.status(400).send({ status: false, message: "please provide reviewId" })

        if (!isValidObjectId(reviewId)) { return res.status(400).send({ status: false, msg: 'Please provide a valid Review Id' }) }

        const  checkReviewId = await reviewModel.findById({ _id: reviewId })
        if (!checkReviewId) {
            return res.status(400).send({ status: false, message: "this review Id is not exist " })
        }
        if(checkReviewId.isDeleted ==true){
            return res.status(400).send({status:false,message:"Review is already deleted"})
        }
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Invalid request parameter,please provide parameter to update" })
        }

        const { reviewedBy, review, rating } = data
        if (reviewedBy) {
            if (!isValid(reviewedBy)) {
                return res.status(404).send({ message: "Please provide The reviewer's name" })
            }
        }
        if (review) {
            if (!isValid(review)) {
                return res.status(404).send({ message: "Please Provide Your Review" })
            }
        }
        if (rating) {
            if (!isValid(rating)) {
                return res.status(404).send({ message: "Please Enter Rating" })
            }
            if (rating < 1 || rating > 5) {
                return res.status(400).send({ status: false, message: "Rating Value Should Be  Between 1 to 5" })
            }
        }

        const updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { ...data }, { new: true }).select({ __v: 0, createdAt: 0, updatedAt: 0, })


        let result = {
            bookId: findbook._id,
            title: findbook.title,
            excerpt: findbook.excerpt,
            userId: findbook.userId,
            category: findbook.category,
            reviews: findbook.review,
            releasedAt: findbook.releasedAt,
            reviewsData: updatedReview
        };
        return res.status(200).send({ status: true, message: "Review updated Successfully", updatedData: result });
    }

    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const deleteReviewById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if(!isValidObjectId(bookId)){
            return res.status(400).send({status:false,message:"Please provide  valid book Id "})
        }
        const checkbookId=await booksModel.findById({_id:bookId})
        if(!checkbookId){
            return res.status(404).send({status:false,message:"This Book Id is not exist"})
        }
        if(checkbookId.isDeleted==true){
            return res.status(400).send({status:false,message:"This Book is already Deleted"})
        }

        let id = req.params.reviewId

        if (!isValidObjectId(id)) { return res.status(400).send({ status: false, msg: 'Please provide a valid Review Id' }) }

        const checkReviewId = await reviewModel.findOne({ _id: id })
        if (!checkReviewId) {
            return res.status(404).send({ status: false, message: "This Review does not exist OR already deleted" })
        }
        if(checkReviewId.isDeleted==true){
            return res.status(400).send({status:false,message:"this review is already deleted"})
        }
        


        const deletedReview = await reviewModel.findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
        const updatedBookreview = await booksModel.findOneAndUpdate({ _id: checkReviewId.bookId }, { $inc: { reviews: -1 } }, { new: true })
        return res.status(200).send({ status: true, message: "Success", data: { deletedReview, ...updatedBookreview.toObject() } })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createReview = createReview;
module.exports.deleteReviewById = deleteReviewById;
module.exports.updateBookReview = updateBookReview;