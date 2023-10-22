const express = require('express');
const router = express.Router();
const multer = require('multer')
const admin = require('firebase-admin');
const serviceAccount = require('../../../../json/school-manager-793a1-firebase-adminsdk-bsrl1-325d545fbf.json');
const Student = require('../../../../models/student');
const fs = require('fs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'gs://school-manager-793a1.appspot.com/'
    });
}

const bucket = admin.storage().bucket();

const upload = multer({
    storage: multer.memoryStorage()
})


router.post('/upload-avatar', upload.single('file'), async (req, res) => {
    try {
        const { studentId } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'Không có tệp hình ảnh.' });
        }

        if (!studentId || studentId.length !== 24) {
            return res.status(400).json({ error: 'studentId không hợp lệ.' });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(400).json({ error: 'Học sinh không tồn tại.' });
        }

        const tempFilePath = `temp_${studentId}_${file.originalname}`;
        fs.writeFileSync(tempFilePath, file.buffer);

        const filePath = tempFilePath
        const fileName = `${studentId}-${file.originalname}`;
        const fileDestination = `graduation-certificates/student_avatar/${studentId}/${fileName}`;

        await bucket.upload(filePath, {
            destination: fileDestination,
        });

        fs.unlinkSync(tempFilePath);

        const [url] = await bucket.file(fileDestination).getSignedUrl({
            action: 'read',
            expires: '03-01-2500',
        });

        student.avatarUrl = url;
        await student.save();

        res.status(201).json({
            message: 'Tải ảnh lên Firebase thành công.', avatarStudentUrl: url
        });
    } catch (error) {
        console.error('Lỗi khi tải ảnh lên Firebase:', error);
        res.status(500).json({ error: 'Lỗi khi tải ảnh lên Firebase.' });
    }
});

router.get('/avatar/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const folderPath = `graduation-certificates/student_avatar/${studentId}/`;
        const [files] = await bucket.getFiles({ prefix: folderPath });

        const imageUrls = [];

        for (const file of files) {
            const imageUrl = await file.getSignedUrl({
                action: 'read',
                expires: '03-01-2500',
            });
            imageUrls.push(imageUrl);
        }

        res.status(201).json({
            status: "SUCCESS",
            message: "Ảnh đại diện của học sinh " + studentId,
            data: imageUrls,
        });
    } catch (error) {
        console.error('Lỗi khi tải ảnh:', error);
        res.status(500).json({ error: 'Lỗi khi tải ảnh.' });
    }
});

router.delete('/delete-avatar/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;

        const studentFolder = `graduation-certificates/student_avatar/${studentId}`;

        const [files] = await bucket.getFiles({ prefix: studentFolder });

        await Promise.all(files.map(async (file) => {
            await file.delete();
        }));

        res.status(201).json({ message: `Đã xóa tất cả hình ảnh trong thư mục của studentId ${studentId}.` });
    } catch (error) {
        console.error('Lỗi khi xóa hình ảnh:', error);
        res.status(500).json({ error: 'Lỗi khi xóa hình ảnh.' });
    }
});

module.exports = router;
