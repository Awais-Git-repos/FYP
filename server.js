const express = require('express');
const connectDB = require('./db/db');
require('dotenv').config();

var app = express();
connectDB();
app.use('/uploads', express.static('uploads'))

var port = process.env.PORT || 5000;

const cors = require('cors')

app.use(cors());
app.use(express.json({ extended: false }))

app.get('/:id', (req, res) => {
    const { id } = req.params
    res.status(200).json({ msg: `Server Listening with variable ${id}` })
})

app.get('/', (req, res) => {
    res.json({ msg: 'Server Running....' })
})

app.use('/register', require('./routes/user'));
app.use('/familyRegister', require('./routes/family'))
app.use('/login', require('./routes/auth'));
app.use('/mailVerify', require('./routes/userEmailVerification'))
app.use('/doorUnlock', require('./routes/door_lock'));

app.use('/forget', require('./routes/forgetPassword'))

app.listen(3000, () => {
    console.log("Server Started on Port: ", 3000);
})
