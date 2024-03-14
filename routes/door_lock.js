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
routes.get('/', async (req, res) => {
    const id = req.user.id;
    try {
        const user = await User.findById(id);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ msg: 'Server error' });
    }
});



module.exports = routes