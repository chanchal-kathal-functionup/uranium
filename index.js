const express = require('express');

var bodyParser = require('body-parser');

const route = require('./routes/route.js');
const multer = require("multer")
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any())


const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://functionUpUranium-2:JECVxS0v96bKoG0a@cluster0.j1yrl.mongodb.net/Group46project-3-DB", { useNewUrlParser: true })
    .then(() => console.log('mongodb is successfully connected'))
    .catch(err => console.log(err))

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});

