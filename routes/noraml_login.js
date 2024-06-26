const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

const User = require('../models/Family');

const router = express.Router();

// @route GET api/auth
// @describe get loggedin user data
// @access Private
router.get('/', auth, async (req, res) => {
    const id = req.user.id;
    try {
        const user = await User.findById(id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ msg: 'Server error' });
    }
});

// @route POST api/auth
// @describe user login
// @access Public
router.post(
    '/',
    [
        check('username', 'Please enter a valid email address').exists(),
        check('password', 'Please enter correct password').exists(),
    ],
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { username, password } = req.body;
        // console.log("REquest body", email+" "+password);
        console.log(username, password);

        try {
            const user = await User.findOne({ username });

            console.log("USER: ", user);
            if (!user) {
                return res.status(200).json({ msg: 'User with this userName does not exist.' });
            }
            console.log("Hello World");
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(200).json({ msg: 'Password Incorrect' });
            }


            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(
                payload,
                process.env.JWTSECRET,
                {
                    expiresIn: 3600000,
                },
                async (err, token) => {
                    if (err) throw err.message;
                    console.log("--The decoded user is----");
                    const decoded = jwt.verify(token, process.env.JWTSECRET);
                    const { user } = decoded;
                    const { id } = user;
                    console.log("The decoded is : ", id);
                    const dt = await User.findOne({ _id: id });
                    const { role } = dt;
                    console.log("The token is: " + token);
                    return res.json({ token });
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ msg: 'Server error' });
        }

    }
);

module.exports = router;