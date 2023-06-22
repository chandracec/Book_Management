const express = require('express');
const route = require('../src/route/route')
const mongoose = require('mongoose')

const app = express();
app.use(express.json());

mongoose.set('strictQuery' , true);

mongoose.connect(
    "mongodb+srv://chandrakant91550:85A3tszzv0FScC1w@cluster0.lcv0ktb.mongodb.net/Book_Management?retryWrites=true&w=majority",
    { useNewUrlParser : true }
)
.then(()=>{
    console.log("Server Connected with MongoDb")
})
.catch((error)=>{
    console.log("Error in connection", error.message)
})

app.use('/',route);

app.listen(3000 , ()=>{
    console.log(`Server running at 3000`)
})

