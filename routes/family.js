const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Family');
const auth = require('../middlewares/auth');

const routes = express.Router();


routes.post('/', [
    check('email', 'enter valid mail address').isEmail(),
    check('contact', 'contact should be in standard format').isLength({ min: 11 }),
    auth
], async (req, res) => {
    // res.send(req.body);
    console.log("The requested id is: ", req.user);
    const result = validationResult(req);

    if (!result.isEmpty()) {
        console.log(result.array());
        return res.status(400).json({ errors: result.array() })

    }
    const { email, contact, start_time, end_time } = req.body;
    console.log(email, contact, start_time, end_time);
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(200).json({ msg: 'User already Exists' });

        }
        user = new User({
            email,
            contact,
            adminId: req.user.id,
        })
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(password, salt);
        await user.save();
        // const payload = {
        //     user: {
        //         id: user.id
        //     },
        // }
        return res.json({ msg: "Register Successfull" })
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



// @Get all users Data
routes.get('/', auth, async (req, res) => {
    console.log("Request Came for Family");
    try {
        const { id } = req.user;
        const users = await User.find({ adminId: id }).populate('adminId');
        console.log(users);
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})


// @Get all registered data
routes.get('/registerAccount', auth, async (req, res) => {
    console.log("Request Hitting");
    try {
        const { id } = req.user;
        const users = await User.find({ adminId: id, username: { $exists: true, $ne: null } });
        res.json(users);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error });
    }
});

// Delete registered data
routes.post('/registered-delete', auth, async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.find({ email })
        if (!user) {
            return res.status(200).json({ msg: "No such user found" })
        }
        await User.deleteOne({ email, username: { $ne: null } })
        return res.status(200).json({ msg: "User Deleted Successfully " })
    } catch (error) {
        console.log("Error: ", error);
        return res.status(400).json({ msg: 'Error deleted' })
    }
})


// @Get delete non-registered data
routes.post('/non-registered-delete/:_id', auth, async (req, res) => {
    try {
        const { _id } = req.params
        const user = await User.find({ _id })
        if (!user) {
            return res.status(200).json({ msg: "No such user found" })
        }
        await User.deleteOne({ _id })
        return res.status(200).json({ msg: "User Deleted Successfully " })
    } catch (error) {
        console.log("Error: ", error);
        return res.status(400).json({ msg: 'Error deleted' })
    }
})














module.exports = routes




