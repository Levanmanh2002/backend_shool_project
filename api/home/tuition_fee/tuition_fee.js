const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const TuitionFee = require("../../../models/tuition_fee");
const Student = require("../../../models/student");
const Notification = require("../../../models/notification");

function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
}

router.post('/create_tuition_fee', async (req, res) => {
    try {
        const uuid = uuidv4();

        let maTraCuu = '';

        do {
            maTraCuu = generateRandomCode(6);

            const existingTuitionFee = await TuitionFee.findOne({ maTraCuu });
            if (!existingTuitionFee) {
                break;
            }
        } while (true);

        req.body.maTraCuu = maTraCuu;
        req.body.feesIds = uuid;

        // Tạo học phí mới cho mỗi sinh viên
        const allStudents = await Student.find({});
        for (const student of allStudents) {
            const newTuitionFee = await TuitionFee.create({
                ...req.body,
                studentIds: student._id
            });
            student.feesToPay.push(newTuitionFee._id);
            await student.save();
        }

        // Tạo thông báo cho học phí mới
        const notificationMessage = `Học phí mới ${maTraCuu} đã được tạo và cập nhật.`;
        const newNotification = new Notification({
            title: 'Tạo học phí mới',
            message: notificationMessage,
            feesIds: 'feesId',
            createdAt: new Date()
        });
        await newNotification.save();

        res.status(201).json({
            status: 'SUCCESS',
            message: 'Đã thêm học phí mới và cập nhật cho tất cả học sinh thành công.',
        });
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm học phí mới và cập nhật cho học sinh.' });
    }
});

router.get('/tuition_fees', async (req, res) => {
    try {
        // Lấy các giá trị maTraCuu duy nhất
        const uniqueMaTraCuu = await TuitionFee.distinct('maTraCuu');

        // Khởi tạo mảng để lưu trữ học phí duy nhất cho mỗi maTraCuu
        const uniqueTuitionFees = [];

        // Lặp qua từng giá trị maTraCuu
        for (const maTraCuu of uniqueMaTraCuu) {
            // Lấy học phí đầu tiên cho mỗi maTraCuu
            const tuitionFee = await TuitionFee.findOne({ maTraCuu });

            // Thêm học phí vào mảng kết quả
            uniqueTuitionFees.push(tuitionFee);
        }

        // Trả về dữ liệu học phí duy nhất cho mỗi maTraCuu
        res.status(201).json({
            status: 'SUCCESS',
            message: 'Đã lấy dữ liệu học phí duy nhất cho mỗi maTraCuu thành công.',
            data: uniqueTuitionFees,
        });
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy dữ liệu học phí.' });
    }
});

router.delete('/delete_tuition_fee/:tuitionFeeId', async (req, res) => {
    const tuitionFeeId = req.params.tuitionFeeId;

    try {
        // Kiểm tra xem có học phí nào có feesIds là tuitionFeeId hay không
        const existingTuitionFee = await TuitionFee.findOne({ feesIds: tuitionFeeId });

        if (!existingTuitionFee) {
            return res.status(404).json({ error: 'Không tìm thấy học phí để xóa.' });
        }

        // Xóa tất cả các học phí có feesIds là tuitionFeeId
        await TuitionFee.deleteMany({ feesIds: tuitionFeeId });

        res.status(201).json({
            status: 'SUCCESS',
            message: 'Đã xóa học phí thành công.',
        });
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa học phí.' });
    }
});

router.put('/update_tuition_fee/:feesIds', async (req, res) => {
    const feesIds = req.params.feesIds;

    try {
        // Chỉnh sửa học phí
        const updatedTuitionFee = await TuitionFee.updateMany({ feesIds }, req.body);

        if (updatedTuitionFee.n === 0) {
            return res.status(404).json({ error: 'Không tìm thấy học phí.' });
        }

        // Cập nhật lại thông tin học phí trên tất cả sinh viên
        const studentsToUpdate = await Student.find({ 'feesToPay.feesIds': feesIds });

        const promises = studentsToUpdate.map(async student => {
            const feesIndex = student.feesToPay.findIndex(fee => fee.feesIds === feesIds);
            if (feesIndex !== -1) {
                student.feesToPay[feesIndex] = req.body; // Cập nhật dữ liệu mới
                await student.save();
            }
        });

        await Promise.all(promises);

        res.status(201).json({
            status: 'SUCCESS',
            message: 'Đã cập nhật học phí và cập nhật dữ liệu sinh viên thành công.',
            data: updatedTuitionFee,
        });
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật học phí và cập nhật dữ liệu sinh viên.' });
    }
});



router.post('/add_tuition_fee_to_student/:studentId', async (req, res) => {
    const studentId = req.params.studentId;

    try {
        // Kiểm tra xem học sinh có tồn tại không
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Không tìm thấy học sinh.' });
        }

        let maTraCuu;
        let isUnique = false;

        // Tạo mã tra cứu mới cho học phí đến khi nào không trùng lặp
        do {
            maTraCuu = generateRandomCode(6);
            const existingTuitionFee = await TuitionFee.findOne({ maTraCuu });
            if (!existingTuitionFee) {
                isUnique = true;
            }
        } while (!isUnique);

        // Tạo học phí mới
        const newTuitionFee = new TuitionFee({
            maTraCuu: maTraCuu,
            tenHocPhi: req.body.tenHocPhi,
            noiDungHocPhi: req.body.noiDungHocPhi,
            soTienPhatHanh: req.body.soTienPhatHanh,
            soTienDong: req.body.soTienDong,
            soTienNo: req.body.soTienNo,
            hanDongTien: req.body.hanDongTien,
        });

        // Lưu học phí mới vào cơ sở dữ liệu
        await newTuitionFee.save();

        // Cập nhật danh sách học phí cần thanh toán của học sinh
        student.feesToPay.push(newTuitionFee._id);
        await student.save();

        res.status(201).json({
            status: 'SUCCESS',
            message: 'Đã thêm học phí cho học sinh thành công.',
            data: newTuitionFee,
        });
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm học phí cho học sinh.' });
    }
});

router.put('/update_tuition_fee_to_student/:studentId/:tuitionFeeId', async (req, res) => {
    const studentId = req.params.studentId;
    const tuitionFeeId = req.params.tuitionFeeId;

    try {
        // Kiểm tra xem học sinh và học phí có tồn tại không
        const student = await Student.findById(studentId);
        const tuitionFee = await TuitionFee.findById(tuitionFeeId);

        if (!student || !tuitionFee) {
            return res.status(404).json({ error: 'Không tìm thấy học sinh hoặc học phí.' });
        }

        // Nhận dữ liệu cập nhật từ yêu cầu
        const updatedData = {
            tenHocPhi: req.body.tenHocPhi,
            noiDungHocPhi: req.body.noiDungHocPhi,
            soTienPhatHanh: req.body.soTienPhatHanh,
            soTienDong: req.body.soTienDong,
            soTienNo: req.body.soTienNo,
            hanDongTien: req.body.hanDongTien,
        };

        // Cập nhật thông tin học phí
        Object.assign(tuitionFee, updatedData);

        // Lưu thay đổi vào cơ sở dữ liệu
        await tuitionFee.save();

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Đã cập nhật học phí cho học sinh thành công.',
            data: tuitionFee,
        });
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật học phí cho học sinh.' });
    }
});

router.delete('/delete_tuition_fee_from_student/:studentId/:tuitionFeeId', async (req, res) => {
    const { studentId, tuitionFeeId } = req.params;

    try {
        // Kiểm tra xem học sinh có tồn tại không
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Không tìm thấy học sinh.' });
        }

        // Kiểm tra xem học phí có tồn tại không
        const tuitionFee = await TuitionFee.findById(tuitionFeeId);
        if (!tuitionFee) {
            return res.status(404).json({ error: 'Không tìm thấy học phí.' });
        }

        // Loại bỏ học phí khỏi danh sách học phí cần thanh toán của học sinh
        const index = student.feesToPay.indexOf(tuitionFeeId);
        if (index !== -1) {
            student.feesToPay.splice(index, 1);
            await student.save();
        }

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Đã xóa học phí của học sinh thành công.',
        });
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa học phí của học sinh.' });
    }
});



// router.get('/search_fees', async (req, res) => {
//     const maTraCuu = req.query.maTraCuu;

//     try {
//         const result = await TuitionFee.find({ maTraCuu: { $regex: maTraCuu, $options: 'i' } });

//         res.status(201).json(result);

//     } catch (error) {
//         console.error('Error searching by maTraCuu:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

module.exports = router;
