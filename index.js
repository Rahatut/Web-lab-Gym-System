const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.get('/check', (req, res) => {
    res.json({ message: "Hello from the router!" });
});

//middleware
app.use(express.json()); //allows your application to read and parse JSON data sent in the request body.
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

//routes
const workoutRouter = require('./routes/workoutRoutes');
const userRouter = require('./routes/userRoutes');
const trainerRouter = require('./routes/trainerRoutes');
const scheduleRouter = require('./routes/scheduleRoutes');

app.use('/api/workouts', workoutRouter);
app.use('/api/users', userRouter);
app.use('/api/trainers', trainerRouter);
app.use('/api/schedules', scheduleRouter);

//monngodb connection and server start
const mongoose = require('mongoose');
mongoose.connect(process.env.MongoDB_URI).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

//install node js
// npm init -y
//npm i express dotenv
//nodemon -g  npm run dev
//env dotenv
//postman

//mongodv: 
//npm i mongodb mongoose (mongoose is what's known as an odm library and odm stands for object data modeling it basically wraps mongodb with
// an extra layer that allows us to use methods to read and write database documents and it also gives us a way to declare models and 
// schemas to ensure a more strict data structure)
//.env  MongoDB_URI="your_mongodb_connection_string"