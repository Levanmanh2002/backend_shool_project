const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const Teacher = require('../../../models/teacher');
const Notification = require('../../../models/notification');

router.post('/add', async (req, res) => {
  try {
    const teacherData = req.body;

    const existingEmail = await Teacher.findOne({ email: teacherData.email });

    if (existingEmail) {
      return res.status(400).json({
        status: 'email_check',
        error: 'Email đã tồn tại.'
      });
    }

    const existingPhoneNumber = await Teacher.findOne({ phoneNumber: teacherData.phoneNumber });

    if (existingPhoneNumber) {
      return res.status(400).json({
        status: 'phone_check',
        error: 'Số điện thoại đã tồn tại.'
      });
    }

    const existingTeacherCode = await Teacher.findOne({ teacherCode: teacherData.teacherCode });

    if (existingTeacherCode) {
      return res.status(400).json({
        status: 'code_check',
        error: 'Mã giáo viên đã tồn tại.'
      });
    }

    const existingCCCD = await Teacher.findOne({ cccd: teacherData.cccd });

    if (existingCCCD) {
      return res.status(400).json({
        status: 'cccd_check',
        error: 'CCCD đã tồn tại.'
      });
    }

    if (!teacherData.gender) {
      teacherData.gender = 'Khác';
    }

    const teacherId = uuidv4();
    const hashedPassword = await bcrypt.hash(teacherData.password, 10);

    teacherData.teacherId = teacherId;
    teacherData.password = hashedPassword;

    const currentTime = new Date();
    teacherData.createdAt = currentTime;
    teacherData.updatedAt = currentTime;

    const newTeacher = new Teacher(teacherData);
    await newTeacher.save();

    const notificationMessage = `Giáo viên mới ${teacherData.fullName} đã được thêm thành công vào hệ thống.`;
    const newNotification = new Notification({
      title: 'Thêm giáo viên mới',
      message: notificationMessage,
      teacherId: newTeacher._id,
      createdAt: new Date()
    });
    await newNotification.save();

    res.status(201).json({
      status: "SUCCESS",
      message: "Giáo viên đã được thêm thành công",
      data: newTeacher
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
});

module.exports = router;



// router.post('/add-many', async (req, res) => {
//   try {
//     const numTeachersToCreate = 100;

//     for (let i = 0; i < numTeachersToCreate; i++) {
//       const teacherData = {
//         // Thêm thông tin của giáo viên tại đây, ví dụ:
//         email: `teacher${i}@example.com`, // Email là duy nhất
//         phoneNumber: `12345678${i}`, // Số điện thoại là duy nhất
//         teacherCode: `TC${i}`, // Mã giáo viên là duy nhất
//         cccd: `CCCD${i}`, // CCCD là duy nhất
//         password: 'password123', // Đặt mật khẩu ở đây
//         // Thêm thông tin khác tùy ý
//       };

//       // Kiểm tra xem email, số điện thoại, mã giáo viên và CCCD có tồn tại trong cơ sở dữ liệu không
//       const existingEmail = await Teacher.findOne({ email: teacherData.email });
//       const existingPhoneNumber = await Teacher.findOne({ phoneNumber: teacherData.phoneNumber });
//       const existingTeacherCode = await Teacher.findOne({ teacherCode: teacherData.teacherCode });
//       const existingCCCD = await Teacher.findOne({ cccd: teacherData.cccd });

//       // Nếu thông tin này đã tồn tại, bỏ qua và tiếp tục vòng lặp
//       if (existingEmail || existingPhoneNumber || existingTeacherCode || existingCCCD) {
//         continue;
//       }

//       // Nếu không có thông tin trùng lặp, tiến hành tạo giáo viên và lưu vào cơ sở dữ liệu
//       const teacherId = uuidv4();
//       const hashedPassword = await bcrypt.hash(teacherData.password, 10);

//       teacherData.teacherId = teacherId;
//       teacherData.password = hashedPassword;

//       const newTeacher = new Teacher(teacherData);
//       await newTeacher.save();
//     }

//     res.status(201).json({
//       status: "SUCCESS",
//       message: "Tạo thành công " + numTeachersToCreate + " giáo viên",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
//   }
// });

// module.exports = router;

