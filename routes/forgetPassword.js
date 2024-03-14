const express = require('express');
const auth = require('../middlewares/auth');
const User = require('../models/Family');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
// const router = require('./users');
const speakeasy = require('speakeasy');
const jwt = require('jsonwebtoken');

const secret = speakeasy.generateSecret({ length: 20 });
const routes = express.Router();

// Globals

var glob_email = '';
var megaToken = '';

console.log("Main file is executing");

var otpFlag = false;
// 

routes.post('/', async (req, res) => {
    const otp = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32',
    });
    req.otp = otp;

    const { email } = req.body;
    // const otp = req.otp
    // console.log(req.user);
    // res.json({ otp });

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ msg: "Wrong email" })
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'kickart11@gmail.com',
                pass: ''
            }
        });
        const mailOptions = {
            from: 'kickart11@gmail.com',
            // to: `${user.email}`,
            to: 'awaiszubair512@gmail.com',
            subject: 'OTP CODE',
            text: `Your OTP Code is ${otp} don't share this code with anyone`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                //   res.send('Mail Error: ', error);
                console.log("Error: ", error);
            } else {
                // res.json({ link })
                // console.log('Email sent:', info.response);
                console.log("Secret key is ", secret.base32);
                console.log(req.otp);
                console.log(`Your OTP is: ${otp}`);
                console.log("OTP is", otp);
                glob_email = email;
                return res.json({ msg: 'Otp send to your registered mail' })
                // ----------------

                // glob_email = email;
                console.log("Email Sent: ", info.response)
                // res.json({ otp });
            }
        });

    } catch (error) {
        console.log(error.message)
        res.status(400).json({ msg: error.message })
    }
    // const token = req.tok;

})



routes.post('/verify', (req, res) => {
    const { id } = req.body;
    const isValid = speakeasy.totp.verify({
        secret: secret.base32,
        encoding: 'base32',
        token: id,
        window: 2,
    });
    req.verify = isValid;
    console.log("Secret key is ", secret.base32);
    console.log("Verify otp is: ", id);
    const verify = req.verify;
    console.log("Verify is ", verify);
    if (!verify) {
        return res.json({ msg: "Wrong otp code" })
    }
    otpFlag = true;

    // Create a new token with the desired data
    // Send the new token in the response
    return res.json({ msg: true });
})

routes.get('/checking', (req, res) => {
    res.json(jwt.verify(megaToken, "secret"))
})

routes.put('/verify', async (req, res) => {
    var { username, password } = req.body;
    if (otpFlag) {
        try {

            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            // const updateUser = await User.findOneAndUpdate({ email: glob_email }, update, { new: true })
            const updateUser = await User.findOneAndUpdate(
                { email: glob_email },
                {
                    $set: {
                        username: username,
                        password: password,
                    }
                },
                { new: true }
            );
            // otpFlag = false;
            // let user = await User.findOne({ emai: glob_email });
            // const payload = {
            //     user: {
            //         id: user._id
            //     },
            // }
            // jwt.sign(
            //     payload,
            //     process.env.JWTSECRET || 'mySecretKey',
            //     {
            //         expiresIn: 3600000,
            //     },
            //     (err, token) => {
            //         if (err) throw err.message;
            //         res.json({ token })
            //     }
            // )
            return res.status(200).json({ updateUser })
        } catch (error) {
            return res.status(500).json({ "msg": error.message })
        }
    }
    return res.json({ msg: "wrong otp code" })

})



routes.put('/password', async (req, res) => {
    var { password } = req.body;
    if (otpFlag) {
        try {

            // const salt = await bcrypt.genSalt(10);
            // password = await bcrypt.hash(password, salt);
            // const updateUser = await User.findOneAndUpdate({ email: glob_email }, update, { new: true })
            const updateUser = await User.findOneAndUpdate(
                { email: glob_email },
                {
                    $set: {
                        password: password,
                    }
                },
                { new: true }
            );
            otpFlag = false;
            console.log(updateUser, password)
            return res.status(200).json({ updateUser })
        } catch (error) {
            return res.status(500).json({ "msg": error.message })
        }
    }
    return res.json({ msg: "wrong otp code" })

})

routes.post('/unlock:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.find({ email: glob_email });
        const { pincode } = user[0];
        if (id == pincode) {
            return res.json({ lock: "true" });
        }
        return res.json({ lock: "false" })
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ msg: 'Server error' });
    }
});

module.exports = routes