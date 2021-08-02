const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const logger = require('./logger');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use(morgan('tiny'));

console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('Morgan enabled....');
}

app.use(logger);

const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'}
    
];


app.post('/morsy/api/courses', (req, res) =>{

    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name

    };
    courses.push(course);
    res.send(course);
});

app.put('/morsy/api/courses/:id', (req, res) =>{
    
    const course = courses.find(c => c.id === parseInt (req.params.id));
    if (!course) return res.status(404).send('The course with the given ID is not found');
    res.send(course);

    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);
        
    course.name = req.body.name;
    res.send();

});

function validateCourse(course){

    const schema = Joi.object({ 
        name: Joi.string().min(3).required()
    })

    return schema.validate(course);
    
}

app.delete('/morsy/api/courses/:id', (req, res) =>{

    const course = courses.find(c => c.id === parseInt (req.params.id));
    if (!course) return res.status(404).send('The course with the given ID is not found');
    res.send(course);

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

app.get('/morsy/api/courses', (req, res) => {
    const sortBy = req.query.sortBy;
    res.send(courses);
    });

app.get('/morsy/api/courses/:id', (req, res) =>{
    const course = courses.find(c => c.id === parseInt (req.params.id));
    if (!course) return res.status(404).send('The course with the given ID is not found');
    res.send(course);
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}.....`));