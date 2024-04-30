const express = require('express');
const connectDB = require('./db/db');
const { SerialPort } = require('serialport');
const Readline = require('@serialport/parser-readline');
const auth = require('./middlewares/auth');
const check = require('./routes/check')
require('dotenv').config();

var app = express();
connectDB();
app.use('/uploads', express.static('uploads'))

// var port = process.env.PORT || 5000;

const cors = require('cors')

// const SERIAL_PORT = '/dev/tty.wchusbserialfa1410'; // Replace 'COM7' with your actual serial port (e.g., 'COM3' on Windows)
// const BAUD_RATE = 9600;

// const config = {
//     path: "COM6",
//     baudRate: 9600,
//     autoOpen: false
// }

// const port = new SerialPort(config);
// const parser = serialPort.pipe(new Readline({ delimiter: '\n' }));

app.use(cors());
app.use(express.json({ extended: false }))


// app.get('/openlock', [auth, check], (req, res) => {
//     port.write("1");
//     return res.status(200).json({ msg: "Response Successfully Sended" })
// })

app.use('/register', require('./routes/user'));
app.use('/familyRegister', require('./routes/family'))
app.use('/login', require('./routes/auth'));
app.use('/normalLogin', require('./routes/noraml_login'))
app.use('/mailVerify', require('./routes/userEmailVerification'))
app.use('/doorUnlock', require('./routes/door_lock'));
app.use('/forget', require('./routes/forgetPassword'))
app.use('/timeAccess', require('./routes/timelevelAccess'))

// port.open((err) => {
//     if (err) {
//         console.log("Error opening the port: " + err.message)
//     }
//     else {
//         console.log("---Connected Successfully---");
//     }
// })

// port.on('data', (data) => {
//     console.log(data.toString());
// })

// port.open('data', (data) => {
//     console.log(data)
// })

app.get('/checking', (req, res) => {
    res.send('Hello World')
})


app.listen(8080, () => {
    console.log("Server Started on Port: ", 8080);
})
