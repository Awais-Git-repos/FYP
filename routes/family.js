const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Family');

const routes = express.Router();


routes.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})


routes.post('/', [
    check('email', 'enter valid mail address').isEmail(),
    check('contact', 'contact should be in standard format').isLength({ min: 11 }),
], async (req, res) => {
    // res.send(req.body);
    const result = validationResult(req);

    if (!result.isEmpty()) {
        console.log(result.array());
        return res.status(400).json({ errors: result.array() })

    }
    const { email, contact, time_access } = req.body;
    console.log(email, contact, time_access);
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already Exists' });

        }
        user = new User({
            email,
            contact,
            time_access
        })
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(password, salt);
        await user.save();
        // const payload = {
        //     user: {
        //         id: user.id
        //     },
        // }
        res.json({ msg: "Register Successfull" })
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
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
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
            otpFlag = false;
            return res.status(200).json({ updateUser })
        } catch (error) {
            return res.status(500).json({ "msg": error.message })
        }
    }
    return res.json({ msg: "wrong otp code" })

})


routes.put('/pincode', async (req, res) => {
    var { pincode } = req.body;
    if (otpFlag) {
        try {

            // const salt = await bcrypt.genSalt(10);
            // password = await bcrypt.hash(password, salt);
            // const updateUser = await User.findOneAndUpdate({ email: glob_email }, update, { new: true })
            const updateUser = await User.findOneAndUpdate(
                { email: glob_email },
                {
                    $set: {
                        pincode: pincode,
                    }
                },
                { new: true }
            );
            otpFlag = false;
            return res.status(200).json({ updateUser })
        } catch (error) {
            return res.status(500).json({ "msg": error.message })
        }
    }
    return res.json({ msg: "wrong otp code" })

})


module.exports = routes