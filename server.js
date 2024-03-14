// const express = require('express');
// const connectDB = require('./db/db');
// require('dotenv').config();

// var app = express();
// // connectDB();
// // app.use('/uploads', express.static('uploads'))

// // var port = process.env.PORT || 5000;
// const cors = require('cors')

// try {
//     connectDB();
//     app.use(cors());
//     app.use(express.json({ extended: false }))

//     app.get('/:id', (req, res) => {
//         const { id } = req.params
//         res.status(200).json({ msg: `Server Listening with variable ${id}` })
//     })

//     app.get('/', (req, res) => {
//         res.json({ msg: 'Server Running....' })
//     })
//     app.listen(3000, () => {
//         console.log("Server Started on Port: ", 3000);
//     })

// } catch (error) {
//     console.error('Database connection error:', error);
// }




// // app.use('/register', require('./routes/user'));
// // app.use('/familyRegister', require('./routes/family'))
// // app.use('/login', require('./routes/auth'));
// // app.use('/mailVerify', require('./routes/userEmailVerification'))
// // app.use('/doorUnlock', require('./routes/door_lock'));

// // app.use('/forget', require('./routes/forgetPassword'))


const express = require('express');
const connectDB = require('./db/db');
require('dotenv').config();

const app = express();
const cors = require('cors');

try {
    // Connect to the database
    connectDB();

    // Set up middleware
    app.use(cors());
    app.use(express.json({ extended: false }));

    // Define routes
    app.get('/:id', (req, res) => {
        const { id } = req.params;
        res.status(200).json({ msg: `Server listening with variable ${id}` });
    });

    app.get('/', (req, res) => {
        res.json({ msg: 'Server running....' });
    });

    // Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
} catch (error) {
    // Handle any errors that occurred during setup
    console.error('Server setup error:', error);
}
