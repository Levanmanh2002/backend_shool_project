const express = require('express');
const router = express.Router();

const imageUrls = [
    { url: 'https://firebasestorage.googleapis.com/v0/b/school-manager-793a1.appspot.com/o/theme%2Ftheme_1.png?alt=media&token=ca4232a2-0e6f-443c-b16c-ca0cff7bdf8a', name: 'Theme 1' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/school-manager-793a1.appspot.com/o/theme%2Ftheme_2.png?alt=media&token=ae3e77d2-bedd-44f2-b004-feee22b81788', name: 'Theme 2' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/school-manager-793a1.appspot.com/o/theme%2Ftheme_3.png?alt=media&token=c759ed68-eb03-4a97-864d-7210e681019a', name: 'Theme 3' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/school-manager-793a1.appspot.com/o/theme%2Ftheme_4.png?alt=media&token=fbbc2342-8d58-4a34-8f8f-64b6a25921b1', name: 'Theme 4' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/school-manager-793a1.appspot.com/o/theme%2Ftheme_5.png?alt=media&token=f11f4232-085a-4b41-8a5d-2fb58d5dec54', name: 'Theme 5' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/school-manager-793a1.appspot.com/o/theme%2Ftheme_6.png?alt=media&token=4b8eb3dd-cd69-48f7-a61e-1172a0077890', name: 'Theme 6' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/school-manager-793a1.appspot.com/o/theme%2Ftheme_7.png?alt=media&token=d43377f3-0f88-42aa-838d-88d6e453a00d', name: 'Theme 7' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/school-manager-793a1.appspot.com/o/theme%2Ftheme_8.png?alt=media&token=4099fc14-4e6a-4ba2-9a3e-cfa60741a444', name: 'Theme 8' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/school-manager-793a1.appspot.com/o/theme%2Ftheme_9.png?alt=media&token=2ce3267c-7a77-41a2-b17b-80b0d4be7b1e', name: 'Theme 9' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/school-manager-793a1.appspot.com/o/theme%2Ftheme_10.png?alt=media&token=b94613ab-b666-419f-9b1b-cbc1728c04b2', name: 'Theme 10' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/school-manager-793a1.appspot.com/o/theme%2Ftheme_11.png?alt=media&token=5e39acfd-aeb7-4832-84d2-86d5f6383700', name: 'Theme 11' },
];


router.get('/images', async (req, res) => {

    res.json(imageUrls);

});


module.exports = router;
