const express = require('express');
const router = express.Router();
const Teacher = require('../../models/teacher');
const Student = require('../../models/student');
const Class = require('../../models/class');


router.get('/total_teacher', async (req, res) => {
    try {
        const totalTeacher = await Teacher.countDocuments({});

        res.status(201).json({
            status: "totalTeacher",
            total: totalTeacher,
            message: "Danh sách các giáo viên",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

router.get('/total_class', async (req, res) => {
    try {
        const totalClass = await Class.countDocuments({});

        res.status(201).json({
            status: "totalTeacher",
            total: totalClass,
            message: "Danh sách các giáo viên",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

router.get('/total_new_student', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();

        const firstDayOfCurrentYear = new Date(currentYear, 0, 1);
        const firstDayOfNextYear = new Date(currentYear + 1, 0, 1);

        const studentsEnrolledThisYear = await Student.countDocuments(
            {
                createdAt: { $gte: firstDayOfCurrentYear, $lt: firstDayOfNextYear },
            }
        );

        res.status(201).json({
            status: "SUCCESS",
            message: 'Danh sách học sinh mới',
            total: studentsEnrolledThisYear,
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách học sinh:', error);
        res.status(500).json({ error: 'Lỗi khi xử lý yêu cầu' });
    }
});


// router.get('/total_all_student', async (req, res) => {
//     try {
//         const totalStudent = await Student.countDocuments({});

//         res.status(201).json({
//             status: "SUCCESS",
//             total: totalStudent,
//             message: "Danh sách các học sinh",
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
//     }
// });


module.exports = router;