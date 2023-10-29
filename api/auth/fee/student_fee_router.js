const express = require('express');
const StudentFee = require('../../../models/student_fee');
const Class = require('../../../models/class');
const Student = require('../../../models/student');
const Semester = require('../../../models/semester');
const router = express.Router();

router.get('/get/:id', async (req, res) => {
    try {
        const result = await StudentFee.findById(req.params.id);

        res.status(201).json({
            status: "SUCCESS",
            message: "Danh sách phí",
            data: result
        });
    } catch (err) {
        console.error('Lỗi khi xóa tài khoản giáo viên:', err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

// khi gọi api này thì truyền vào theo kiểu query với 2 kiểu dữ liệu sau
// student_id, class_id, semester_id
router.get('/get-by-student', async (req, res) => {
    try {
        const student_id = req.query.student_id;
        const class_id = req.query.class_id;
        const semester_id = req.query.semester_id;

        if(student_id == null && class_id == null ) {
            return res.status(205).send({
                status: "FAIL",
                message: "Dữ liệu đầu vào không hợp lệ",
            }); 
        }
        const result = await StudentFee.find({
            semester_id: semester_id,
            $or: [
                { studentId: id},
                { classId: class_id }
            ],
           
        });

        res.status(201).json({
            status: "SUCCESS",
            message: "Danh sách phí",
            data: result
        });
    } catch (err) {
        console.error('Lỗi khi xóa tài khoản giáo viên:', err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

router.post('/create-class-fee', async (req, res) => {
    try{
        const fee = req.body.fee; // danh sách các phí
        const classId = req.body.class_id;
        const semester_id = req.body.semester_id;

        const studentClass = await Class.findById(classId);
        const semester = await Semester.findById(semester_id);

        if(studentClass == null) {
            return res.status(205).send({
                status: "FAIL",
                message: "Không tồn tại lớp",
            }); 
        }

        const studentFee = new StudentFee()
        studentFee.semester = semester;
        studentFee.semester_id = semester_id;
        studentFee.class = studentClass;
        studentFee.classId = classId;
        studentFee.fees = fee;
        await studentFee.save();

        res.status(201).send({
            status: "SUCCESS",
            message: "Tạo học phí cho lớp thành công",
        }); 

    } catch(e) {
        console.log(e);
        res.status(500).send({ error: 'Lỗi máy chủ nội bộ' });
    }
})

router.post('/create-student-fee', async (req, res) => {
    try{
        const fee = req.body.fee; // danh sách các phí
        const studentId = req.body.student_id;
        const semester_id = req.body.semester_id;

        const student = await Student.findById(studentId);
        const semester = await Semester.findById(semester_id);

        if(student == null) {
            return res.status(205).send({
                status: "FAIL",
                message: "Không tồn tại hoc sinh",
            }); 
        }

        const studentFee = new StudentFee();
        studentFee.semester = semester;
        studentFee.semester_id = semester_id;
        studentFee.student = student;
        studentFee.studentId = studentId;
        studentFee.fees = fee;
        await studentFee.save();

        res.status(201).send({
            status: "SUCCESS",
            message: "Tạo học phí cho lớp thành công",
        }); 

    } catch(e) {
        console.log(e);
        res.status(500).send({ error: 'Lỗi máy chủ nội bộ' });
    }
})

router.put('/update/:id', async (req, res) => {
    try{
        const studentId = req.body.student_id;
        const classId = req.body.class_id;
        const fees = req.body.fees; // danh sách các phí
        const semester_id = req.body.semester_id;
        const studentFee = await StudentFee.findById(req.params.id);

        if(studentFee == null) {
            return res.status(205).send({
                status: "FAIL",
                message: "Không tồn tại phí theo id",
            });
        }

        if(studentId != null) {
            const student = await Student.findById(studentId);

            if(student == null) {
                return res.status(205).send({
                    status: "FAIL",
                    message: "Không tồn tại hoc sinh",
                }); 
            }
            studentFee.student = student;
            studentFee.studentId = studentId;
        } else if(classId != null) {
            const studentClass = await Class.findById(classId);

            if(studentClass == null) {
                return res.status(205).send({
                    status: "FAIL",
                    message: "Không tồn tại lớp",
                }); 
            }

            studentFee.class = studentClass;
            studentFee.classId = classId;
        }

        if(semester_id != null) {
            const semester = await Semester.findById(semester_id);
            studentFee.semester_id = semester_id;
            studentFee.semester = semester;
        }

        studentFee.fees = fees;
        await studentFee.save();

        res.status(201).send({
            status: "SUCCESS",
            message: "Cập nhật học phí cho lớp thành công",
            data: studentFee
        }); 

    } catch(e) {
        console.log(e);
        res.status(500).send({ error: 'Lỗi máy chủ nội bộ' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try{
        const result = await StudentFee.findByIdAndDelete(req.params.id);

        if(result == null) {
            return res.status(205).send({
                status: "FAIL",
                message: "Không tồn tại phí theo id",
            });
        }

        res.status(201).send({
            status: "SUCCESS",
            message: "Xóa học phí cho lớp thành công",
        }); 
    } catch(e) {
        console.log(e);
        res.status(500).send({ error: 'Lỗi máy chủ nội bộ' });
    }
});

// router.put('/add-new-fee/:id', async (req, res) => {
//     try{
//         const fee = req.body.fees; // danh sách các phí (lấy data từ model Fee gọi lên server)

//         const studentFee = await StudentFee.findById(req.params.id);
//         if(studentFee == null) {
//             return res.status(205).send({
//                 status: "FAIL",
//                 message: "Không tồn tại phí theo id",
//             });
//         }

//         studentFee.fees.push(fee);
//         await studentFee.save();

//         res.status(201).send({
//             status: "SUCCESS",
//             message: "Cập nhật các phí thành công",
//             data: studentFee
//         }); 

//     } catch(e) {
//         console.log(e);
//         res.status(500).send({ error: 'Lỗi máy chủ nội bộ' });
//     }
// })

// router.put('/delete-new-fee/:id', async (req, res) => {
//     try{
//         const fees_id = req.body.fees_id; // danh sách các phí theo id

//         const studentFee = await StudentFee.findById(req.params.id);
//         if(studentFee == null) {
//             return res.status(205).send({
//                 status: "FAIL",
//                 message: "Không tồn tại phí theo id",
//             });
//         }

//         const fee = studentFee.fees;

//         for(const id of fees_id) {
//             const currentIndex = fee.findIndex((val, index, arr) => val.id == id);
//             if(currentIndex != -1) {
//                 fee.slice(currentIndex, 1);
//             }
//         }
        
//         studentFee.fees = fee;
//         await studentFee.save();

//         res.status(201).send({
//             status: "SUCCESS",
//             message: "Cập nhật các phí thành công",
//             data: studentFee
//         }); 

//     } catch(e) {
//         console.log(e);
//         res.status(500).send({ error: 'Lỗi máy chủ nội bộ' });
//     }
// })

module.exports = router;
