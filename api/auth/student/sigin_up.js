const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");
const userFormatTemplate = require('../html/user_format');
// const faker = require('faker');

const Student = require("../../../models/student");
const Major = require("../../../models/major");

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

router.post('/signup', async (req, res) => {
    try {
        const studentData = req.body;

        const existingGmail = await Student.findOne({ gmail: studentData.gmail });
        if (existingGmail) {
            return res.status(400).json({
                status: "check_email",
                error: 'Gmail already exists'
            });
        }

        const existingPhone = await Student.findOne({ phone: studentData.phone });
        if (existingPhone) {
            return res.status(400).json({
                status: "check_phone",
                error: 'Phone already exists'
            });
        }

        const existingCccd = await Student.findOne({ cccd: studentData.cccd });
        if (existingCccd) {
            return res.status(400).json({
                status: "check_cccd",
                error: 'CCCD already exists'
            });
        }

        // Kiểm tra xem ngành nghề đã được chọn chưa
        if (!studentData.major) {
            return res.status(400).json({
                status: "missing_major",
                error: 'Vui lòng cung cấp chuyên ngành cho sinh viên'
            });
        }

        // Kiểm tra xem ngành nghề có hợp lệ không
        const existingMajor = await Major.findById(studentData.major);
        if (!existingMajor) {
            return res.status(400).json({
                status: "invalid_major",
                error: 'Chuyên ngành được cung cấp không hợp lệ'
            });
        }

        // const year = new Date().getFullYear().toString().slice(-2);
        // const year = studentData.customYear.slice(-2);
        // Assuming studentData.customYear is optional, provide a default value if it's not provided
        const year = (studentData.customYear || new Date().getFullYear().toString()).slice(-2);

        // const count = 10;
        const count = await Student.countDocuments();

        let khoadau;

        if (count.toString().startsWith('12')) {
            khoadau = count.toString().substring(0, 2);
        } else {
            khoadau = year;
        }

        let mssv;

        if (count >= 1 && count < 10) {
            mssv = `${khoadau}000000${count}`;
        } else if (count >= 10 && count < 100) {
            mssv = `${khoadau}00000${count}`;
        } else if (count >= 100 && count < 1000) {
            mssv = `${khoadau}0000${count}`;
        } else if (count >= 1000 && count < 10000) {
            mssv = `${khoadau}000${count}`;
        } else {
            mssv = `${khoadau}${count.toString().padStart(9, '0')}`;
        }


        const password = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        const studentId = uuidv4();

        const currentTime = new Date();

        studentData.studentId = studentId;
        studentData.mssv = mssv;
        studentData.password = hashedPassword;
        studentData.major = existingMajor._id;
        studentData.createdAt = currentTime;
        studentData.updatedAt = currentTime;
        const student = new Student(studentData);

        await student.save();

        const emailHtml = userFormatTemplate.userFormatTemplate
            .replace('$fullName', studentData.fullName)
            .replace('$mssv', mssv)
            .replace('$password', password);

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: studentData.gmail,
            subject: 'Thông tin tài khoản',
            html: emailHtml
        };


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).json({ error: 'Error sending email' });
            } else {
                res.status(201).json({
                    status: "SUCCESS",
                    message: "Check your email for the account information",
                    mssv: mssv,
                    password: password,
                });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

// http://localhost:3000/admin/auto-generate-students
// router.post('/auto-generate-students', async (req, res) => {
//     try {
//         const totalStudents = 1000;

//         for (let i = 0; i < totalStudents; i++) {
//             const year = new Date().getFullYear().toString().slice(-2);
//             const count = await Student.countDocuments();

//             let khoadau;

//             if (count.toString().startsWith('12')) {
//                 khoadau = count.toString().substring(0, 2);
//             } else {
//                 khoadau = year;
//             }

//             let mssv;

//             if (count >= 1 && count < 10) {
//                 mssv = `${khoadau}000000${count}`;
//             } else if (count >= 10 && count < 100) {
//                 mssv = `${khoadau}00000${count}`;
//             } else if (count >= 100 && count < 1000) {
//                 mssv = `${khoadau}0000${count}`;
//             } else if (count >= 1000 && count < 10000) {
//                 mssv = `${khoadau}000${count}`;
//             } else {
//                 mssv = `${khoadau}${count.toString().padStart(9, '0')}`;
//             }

//             const password = 'manh1234';
//             const hashedPassword = await bcrypt.hash(password, 10);

//             const studentId = uuidv4();

//             const studentData = {
//                 studentId: studentId,
//                 gmail: faker.internet.email(),
//                 phone: faker.phone.phoneNumber(),
//                 fullName: faker.name.findName(),
//                 birthDate: new Date(),
//                 cccd: faker.random.number({ min: 100000000, max: 999999999 }).toString(),
//                 birthPlace: faker.address.city(),
//                 customYear: year,
//                 mssv: mssv,
//                 password: hashedPassword,
//                 gender: faker.random.arrayElement(['Male', 'Female']),
//                 hometown: faker.address.city(),
//                 permanentAddress: faker.address.streetAddress(),
//                 occupation: faker.name.jobTitle(),
//                 students: [],
//                 contactPhone: faker.phone.phoneNumber(),
//                 contactAddress: faker.address.streetAddress(),
//                 educationLevel: faker.random.word(),
//                 graduationCertificate: [faker.random.word()],
//                 academicPerformance: faker.random.word(),
//                 conduct: faker.random.word(),
//                 classRanking10: faker.random.word(),
//                 classRanking11: faker.random.word(),
//                 classRanking12: faker.random.word(),
//                 graduationYear: faker.datatype.number({ min: 2022, max: 2023 }).toString(),
//                 ethnicity: faker.random.word(),
//                 religion: faker.random.word(),
//                 beneficiary: faker.random.word(),
//                 area: faker.random.word(),
//                 idCardIssuedDate: faker.date.past(),
//                 idCardIssuedPlace: faker.address.city(),
//                 fatherFullName: faker.name.findName(),
//                 motherFullName: faker.name.findName(),
//                 notes: faker.random.words(),
//                 avatarUrl: faker.image.avatar(),
//                 verificationCode: '',
//                 resetTokenExpiration: null,
//                 isStudying: true,
//             };

//             const student = new Student(studentData);

//             await student.save();
//         }

//         res.status(201).json({ message: 'Tạo học sinh tự động thành công' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// module.exports = router;