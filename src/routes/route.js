const express = require('express');

const router = express.Router();

let players = [
    {
        "name": "manish",
        "dob": "1/1/1995",
        "gender": "male",
        "city": "jalandhar",
        "sports": [
            "swimming"
        ]
    },
    {
        "name": "Chanchal",
        "dob": "10/04/2000",
        "gender": "female",
        "city": "sagar",
        "sports": [
            "cricket"
        ]
    },
    {
        "name": "Sumit",
        "dob": "23/02/1998",
        "gender": "male",
        "city": "patna",
        "sports": [
            "cricket"
        ]
    },
    {
        "name": "ronaldo",
        "dob": "1/1/1981",
        "gender": "male",
        "city": "delhi",
        "sports": [
            "footbal"
        ]
    },
    {
        "name": "Ritik",
        "dob": "14/05/1998",
        "gender": "male",
        "city": "darjling",
        "sports": [
            "mma"
        ]
    }

];





// const playerEntry =require('../controllers/playerEntry');
router.post('/players', function (req, res) {

    //LOGIC WILL COME HERE
    for (let i = 0; i < players.length; i++) {
        if (req.body.name === players[i].name) {
          return  res.send("Player already rejister try diffrent name")
            
        }
    }
    let newPlayer = req.body
    players.push(newPlayer)
    
    res.send({UpdatedList:players})


    // res.send(  { data: players , status: true }  )
})




// router.get('/test-api4', function (req, res) {

//     res.send({ msg: "Hi FUnctionUp..again..this is another similar api ..not I am getting bored!" })
// });


// router.get('/test-api5', function (req, res) {

//     res.send({ msg: "Hi FUnctionUp", name: "FunctionUp", age: "100" })
// });



// router.get('/test-api6', function (req, res) {

//     res.send({ data: [12, 24, 36, 48, 60] })
// });

// router.post('/test-post1', function (req, res) {

//     res.send({ msg: "hi guys" })
// });


// // to send data in  post request-> prefer sending in BODY -> click body-raw-json
// router.post('/test-post2', function (req, res) {
//     let data = req.body
//     console.log(data)
//     res.send({ msg: "hi guys..my 2nd post req" })
// });


// const randomController = require("../controllers/randomController.js")
// //write a post request to accept an element in post request body and add it to the given array and return the new array
// router.post('/test-post3', randomController.addToArray); //HANDLER/CONTROLLER



module.exports = router;