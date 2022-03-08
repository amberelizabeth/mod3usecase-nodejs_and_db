const express = require('express');
const app = express();

const config = require('./config');
const Student = require('./Models/Student');

config.authenticate().then(()=>{
    console.log('Database is connected.');
}).catch((error)=>{
    console.log(error);
});

//for displaying all students in our database
app.get('/', (req,res)=>{
    Student.findAll().then((result)=>{
        res.status(200).send(result);
    }).catch((err)=>{
        res.send(err);
    });
});

app.listen(3000, function(){
    console.log('Server listening on port 3000....');
});