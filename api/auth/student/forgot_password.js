const express = require('express');
const router = express.Router();

const Student = require("../../../models/student");

const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');

const mailFormat = require('./mail_format');

const activeResetRequests = {};

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

router.post('/reset-password', async (req, res) => {
    try {
        const email = req.body.gmail;

        const currentTime = Date.now();
        if (activeResetRequests[email] && currentTime - activeResetRequests[email] < 5 * 60 * 1000) {
            return res.status(429).json({
                status: "requestsExists",
                message: "Too many requests. Please wait before requesting again."
            });
        }

        const student = await Student.findOne({ gmail: email });

        if (!student) {
            res.status(400).json({
                status: "emailExists",
                message: "Email not found"
            });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        const expirationTime = currentTime + (30 * 60 * 1000);
        student.verificationCode = verificationCode;
        student.resetTokenExpiration = expirationTime;
        await student.save();

        const remainingTime = new Date(expirationTime - currentTime).toISOString().substr(11, 8);

        const formattedVerificationCode = String(verificationCode).split('').join(' ');
        const emailHtml = mailFormat.otpTemplate
            .replace('$email', email)
            .replace('$otpCode', formattedVerificationCode)
            .replace('$remainingTime', remainingTime);

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'Password Reset Verification Code',
            html: emailHtml
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log(error);
            } else {
                activeResetRequests[email] = currentTime;
                res.status(201).json({
                    status: "SUCCESS",
                    message: "Check your email for the password reset"
                });
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "serverFAILED",
            message: "Internal Server Error"
        });
    }
});


router.post('/recover-account', async (req, res) => {
    try {
        const { verificationCode, newPassword } = req.body;
        const student = await Student.findOne({ verificationCode });

        if (!student) {
            return res.status(400).json({
                status: 'verifiExists',
                message: 'Invalid verification code'
            });
        }

        if (student.resetTokenExpiration < Date.now()) {
            return res.status(400).json({
                status: 'expiredExists',
                message: 'Verification code has expired'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        student.password = hashedPassword;
        student.verificationCode = null;
        student.resetTokenExpiration = null;
        await student.save();

        res.status(201).json({
            status: 'SUCCESS',
            message: 'Password reset successful',
            student,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Internal Server Error'
        });
    }
});

module.exports = router;