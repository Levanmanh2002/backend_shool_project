const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('../../../json/school-manager-793a1-firebase-adminsdk-bsrl1-325d545fbf.json');
const fs = require('fs');

const Other = require('../../../models/other');
const Notification = require('../../../models/notification');

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

router.post('/add-uniform', upload.single('file'), async (req, res) => {
    try {

        const { name, money, quantity, note } = req.body;
        const file = req.file;

        const uuid = uuidv4();

        const tempFilePath = `temp_${uuid}_${file.originalname}`;
        fs.writeFileSync(tempFilePath, file.buffer);

        const filePath = tempFilePath
        const fileDestination = `other_uniform/${uuid}/${file.originalname}`;

        await bucket.upload(filePath, {
            destination: fileDestination,
        });

        fs.unlinkSync(tempFilePath);

        const [url] = await bucket.file(fileDestination).getSignedUrl({
            action: 'read',
            expires: '03-01-2500',
        });

        const newUniform = new Other({
            name,
            money,
            quantity,
            note,
            image: url,
        });

        const savedUniform = await newUniform.save();

        const notificationMessage = `Khoản thu mới ${name} đã được thêm vào hệ thống.`;
        const newNotification = new Notification({
            title: 'Thêm khoản thu mới',
            message: notificationMessage,
            uniformIds: 'uniformId',
            createdAt: new Date()
        });
        await newNotification.save();

        res.status(201).json(savedUniform);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/edit-uniform/:id', upload.single('file'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, money, quantity, note } = req.body;
        const file = req.file;

        let uniform = await Other.findById(id);

        if (!uniform) {
            return res.status(404).json({ message: "Uniform not found" });
        }

        if (file) {
            const uuid = uuidv4();
            const tempFilePath = `temp_${uuid}_${file.originalname}`;
            fs.writeFileSync(tempFilePath, file.buffer);

            const fileDestination = `other_uniform/${uuid}/${file.originalname}`;

            await bucket.upload(tempFilePath, {
                destination: fileDestination,
            });

            fs.unlinkSync(tempFilePath);

            const [url] = await bucket.file(fileDestination).getSignedUrl({
                action: 'read',
                expires: '2500-01-03',
            });

            uniform.image = url;
        }

        uniform.name = name;
        uniform.money = money;
        uniform.quantity = quantity;
        uniform.note = note;
        uniform.updatedAt = Date.now();

        const updatedUniform = await uniform.save();

        res.status(200).json(updatedUniform);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/delete-uniform/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await Other.findByIdAndDelete(id);

        res.status(200).json({ message: "Uniform deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/uniforms', async (req, res) => {
    try {
        const uniforms = await Other.find();

        res.status(200).json(uniforms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
