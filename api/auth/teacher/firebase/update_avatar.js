const express = require('express');
const router = express.Router();
const multer = require('multer')
const admin = require('firebase-admin');
const serviceAccount = require('../../../../json/school-manager-793a1-firebase-adminsdk-bsrl1-325d545fbf.json');
const Teacher = require('../../../../models/teacher');
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

router.post('/upload-avatar-teacher', upload.single('file'), async (req, res) => {
    try {
        const { teacherId } = req.body;
        const file = req.file;

        const tempFilePath = `teacher_avatars_${teacherId}_${file.originalname}.jpg`;
        fs.writeFileSync(tempFilePath, file.buffer);

        const filePath = tempFilePath
        const fileName = `${teacherId}-${file.originalname}`;
        const fileDestination = `teacher_avatar/${teacherId}/${fileName}`;

        await bucket.upload(filePath, {
            destination: fileDestination,
        });

        fs.unlinkSync(tempFilePath);

        const imageUrl = await bucket.file(fileDestination).getSignedUrl({
            action: 'read',
            expires: '03-01-2500',
        });

        let teacher = await Teacher.findOne({ teacherId });

        if (teacher.avatarUrl) {
            teacher.avatarUrl = imageUrl[0];
        } else {
            teacher.avatarUrl = imageUrl[0];
        }

        await teacher.save();

        res.status(201).json({ message: 'Avatar uploaded and URL saved successfully.' });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ error: 'An error occurred while uploading avatar.' });
    }
});

// router.put('/edit-avatar/:teacherId', upload.single('file'), async (req, res) => {
//     try {
//         const teacherId = req.params.teacherId;
//         const file = req.file;

//         if (!file) {
//             return res.status(400).json({ error: 'Không có tệp hình ảnh.' });
//         }

//         if (!teacherId || teacherId.length !== 24) {
//             return res.status(400).json({ error: 'teacherId không hợp lệ.' });
//         }

//         const teacher = await Teacher.findById(teacherId);
//         if (!teacher) {
//             return res.status(404).json({ error: 'Giáo viên không tồn tại.' });
//         }

//         const tempFilePath = `temp_${teacherId}_${file.originalname}`;
//         fs.writeFileSync(tempFilePath, file.buffer);
//         const filePath = tempFilePath;
//         const fileName = `${teacherId}-${file.originalname}`;
//         const fileDestination = `graduation-certificates/teacher_image/${teacherId}/${fileName}`;
//         await bucket.upload(filePath, {
//             destination: fileDestination,
//         });
//         fs.unlinkSync(tempFilePath);

//         const [url] = await bucket.file(fileDestination).getSignedUrl({
//             action: 'read',
//             expires: '03-01-2500',
//         });

//         teacher.avatarUrl = url;
//         await teacher.save();

//         res.status(201).json({ message: 'Chỉnh sửa ảnh thành công.', newAvatarUrl: url });
//     } catch (error) {
//         console.error('Lỗi khi chỉnh sửa ảnh:', error);
//         res.status(500).json({ error: 'Lỗi khi chỉnh sửa ảnh.' });
//     }
// });


// router.get('/images/:teacherId', async (req, res) => {
//     try {
//         const teacherId = req.params.teacherId;
//         const folderPath = `graduation-certificates/teacher_image/${teacherId}/`;
//         const [files] = await bucket.getFiles({ prefix: folderPath });

//         const imageUrls = [];

//         for (const file of files) {
//             const imageUrl = await file.getSignedUrl({
//                 action: 'read',
//                 expires: '03-01-2500',
//             });
//             imageUrls.push(imageUrl);
//         }

//         res.status(201).json({
//             status: "SUCCESS",
//             message: "Avatar của " + teacherId,
//             data: imageUrls,
//         });
//     } catch (error) {
//         console.error('Lỗi khi tải ảnh:', error);
//         res.status(500).json({ error: 'Lỗi khi tải ảnh.' });
//     }
// });

// router.delete('/delete-images/:teacherId', async (req, res) => {
//     try {
//         const { teacherId } = req.params;

//         const teacherFolder = `graduation-certificates/teacher_image/${teacherId}`;

//         const [files] = await bucket.getFiles({ prefix: teacherFolder });

//         await Promise.all(files.map(async (file) => {
//             await file.delete();
//         }));

//         res.status(201).json({ message: `Đã xóa tất cả hình ảnh trong thư mục của teacherId ${teacherId}.` });
//     } catch (error) {
//         console.error('Lỗi khi xóa hình ảnh:', error);
//         res.status(500).json({ error: 'Lỗi khi xóa hình ảnh.' });
//     }
// });

module.exports = router;
