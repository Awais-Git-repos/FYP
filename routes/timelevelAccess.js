const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Family');
const auth = require('../middlewares/auth');
const routes = express.Router();

// POST: SAVE TIME 
routes.put('/updateTime/:_id', auth, async (req, res) => {
    const { _id } = req.params;
    const { startTime, endTime, status } = req.body;
    console.log("StartTime", startTime);
    console.log("EndTime", endTime);

    try {
        const user = await User.findByIdAndUpdate(_id, { start_time: startTime, end_time: endTime, time_status: status }, { new: true });

        if (!user) {
            return res.status(200).json({ msg: "User not found" });
        }
        console.log(user);

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error updating time:", error.message);
        return res.status(500).json({ msg: "Server Error" });
    }
});


routes.put('/updateStatus/:_id', auth, async (req, res) => {
    const { _id } = req.params;
    const { status } = req.body;

    try {
        const user = await User.findByIdAndUpdate(_id, { start_time: '', end_time: '', time_status: status }, { new: true });

        if (!user) {
            return res.status(200).json({ msg: "User not found" });
        }
        console.log(user);

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error updating time:", error.message);
        return res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = routes;
