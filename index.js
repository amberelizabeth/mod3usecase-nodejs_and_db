const express = require('express');
const app = express();
const config = require('./config');
const Student = require('./Models/Student');
const Op = require('sequelize').Op;

app.use(express.urlencoded({extended: false}));


const routeTracker = function(req, res, next){
    switch( req.method ){
        case "GET":
            app.locals.getStudent += 1;
            break;
        case "POST":
            app.locals.postStudent += 1;
            break;
        case "PATCH":
            app.locals.updateStudent += 1;
            break;
        case "DELETE":
            app.locals.deleteStudent += 1;
            break;
        default:
            console.log("NONE");
    }

    console.log(`\nGET:    ${app.locals.getStudent}`);
    console.log(`POST:   ${app.locals.postStudent}`);
    console.log(`UPDATE: ${app.locals.updateStudent}`);
    console.log(`DELETE: ${app.locals.deleteStudent}`);
    next();
}

//Establish connection to database
config.authenticate().then(function(){
    console.log('Database is connected');
}).catch(function(err){
    console.log(err);
});

//Get students
app.get('/', routeTracker, (req, res)=>{
    let data = {
        where: {id:  {[Op.ne]: null}}
    }
    //student id filter
    if(req.body.id !== undefined){
        data.where.id = req.body.id;
    }
    //filter by section
    if(req.body.section !== undefined){
        data.where.section = req.body.section;
    }

    Student.findAll(data).then((result)=>{
        res.status(200).send(result);
    }).catch((err)=>{
        res.status(500).send(err);
    });
});

//Create a new student
app.post('/', routeTracker, (req, res)=>{
    Student.create(req.body).then((result)=>{
        res.redirect('/'); //Redirect to the get route to display all students
    }).catch((err)=>{
        res.status(500).send(err);
    });
});

//Update name of a student
app.patch('/:student_id', routeTracker, (req, res)=>{
    app.locals.updateStudent += 1;
    let studentId = parseInt(req.params.student_id);

    //Find the student 
    Student.findByPk(studentId).then((result)=>{

        if(result){
            if(req.body.name !== undefined){
                result.name = req.body.name;
            }
            if(req.body.gpa !== undefined){
                result.gpa = parseFloat(req.body.gpa);
            }
            if(req.body.section !== undefined){
                result.section = req.body.section;
            }
            if(req.body.nationality !== undefined){
                result.nationality = req.body.nationality;
            }
       
            //Save changes to DB
            result.save().then(()=>{
                res.status(200).send(result);
            }).catch((err)=>{
                res.status(500).send(err);
            });
        }
        else {
            res.status(404).send('Student record not found');
        }

    }).catch((err)=>{
        res.status(500).send(err);
    });
});

//Delete a student record
app.delete('/:student_id', routeTracker, (req, res)=>{
    let studentId = req.params.student_id;

    //Find the student
    Student.findByPk(studentId).then((result)=>{

        if(result){
            //Delete student from database
            result.destroy().then(()=>{
                res.status(200).send(result);
            }).catch((err)=>{
                res.status(500).send(err);
            });
        }
        else {
            res.status(404).send('Student record not found');
        }
    }).catch((err)=>{
        res.status(500).send(err);
    });
});


app.listen(3000, ()=>{
    app.locals.getStudent = 0;
    app.locals.postStudent = 0;
    app.locals.updateStudent = 0;
    app.locals.deleteStudent = 0;

    console.log('Server running on port 3000...');
});