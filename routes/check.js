const User = require('../models/Family');

module.exports = async function (req, res, next) {

    function checkTime(startTime, endTime) {
        const currentTime = new Date();
        const start = new Date();
        const end = new Date();

        // Convert start and end time strings to Date objects
        start.setHours(parseHour(startTime), parseMinute(startTime), 0);
        end.setHours(parseHour(endTime), parseMinute(endTime), 0);

        // Compare current time with start and end times
        if (currentTime >= start && currentTime <= end) {
            return true;
        } else {
            return false;
        }
    }

    // Function to parse hour from time string
    function parseHour(timeString) {
        const timeParts = timeString.split(':');
        let hour = parseInt(timeParts[0]);
        const period = timeParts[1].split(' ')[1]; // Extract AM/PM

        if (period.toLowerCase() === 'pm' && hour !== 12) {
            hour += 12; // Convert to 24-hour format
        } else if (period.toLowerCase() === 'am' && hour === 12) {
            hour = 0; // Convert 12 AM to 0
        }

        return hour;
    }

    // Function to parse minute from time string
    function parseMinute(timeString) {
        const timeParts = timeString.split(':');
        return parseInt(timeParts[1].split(' ')[0]); // Extract minutes
    }

    // Example start and end time
    var startTime = '9:31 pm';
    var endTime = '9:45 pm';

    // Example user input
    const userInput = 'hello';

    // Check if current time is within the provided time range and user input is 'hello'
    console.log("The user is: ", req.user);
    try {
        const user = await User.findById(req.user.id);
        if (user.time_status == '0') {
            console.log("Time Free Access");
            return next();
        }
        else {
            startTime = user.start_time;
            endTime = user.end_time
            console.log("The main user is: ", user);
        }
    } catch (error) {
        console.log(error.message);
        // Handle error
    }
    if (checkTime(startTime, endTime) && userInput === 'hello') {
        console.log("OK");
        next();
    } else {
        console.log("FALSE");
        return res.status(200).json({ msg: 'Temporary Blocked' })
    }
}




// const User = require('../models/Family');

// module.exports = async function (req, res, next) {
//     function checkTime(startTime, endTime) {
//         const currentTime = new Date();
//         const start = new Date();
//         const end = new Date();

//         // Convert start and end time strings to Date objects
//         start.setHours(parseHour(startTime), parseMinute(startTime), 0);
//         end.setHours(parseHour(endTime), parseMinute(endTime), 0);

//         // Compare current time with start and end times
//         return currentTime >= start && currentTime <= end;
//     }

//     function parseHour(timeString) {
//         const timeParts = timeString.split(':');
//         let hour = parseInt(timeParts[0]);
//         const period = timeParts[1].split(' ')[1]; // Extract AM/PM

//         if (period.toLowerCase() === 'pm' && hour !== 12) {
//             hour += 12; // Convert to 24-hour format
//         } else if (period.toLowerCase() === 'am' && hour === 12) {
//             hour = 0; // Convert 12 AM to 0
//         }

//         return hour;
//     }

//     function parseMinute(timeString) {
//         const timeParts = timeString.split(':');
//         return parseInt(timeParts[1].split(' ')[0]); // Extract minutes
//     }

//     try {
//         const user = await User.findById(req.user.id);
//         if (user.time_status == '0') {
//             console.log("Time Free Access");
//             return next(); // If time_status is '0', proceed to next middleware
//         } else {
//             startTime = user.start_time;
//             endTime = user.end_time;
//             console.log("The main user is: ", user);
//         }
//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }

//     if (checkTime(startTime, endTime) && req.body.userInput === 'hello') {
//         console.log("OK");
//         return next(); // If within time range and userInput is 'hello', proceed
//     } else {
//         console.log("FALSE");
//         return res.status(200).json({ msg: 'Temporary Blocked' });
//     }
// }
