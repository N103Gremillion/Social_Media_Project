const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/getProfilePicture', (req, res) => {
  const userId = req.query.userId;

    const getImagePathQuery = 'SELECT image_path FROM user_images WHERE user_id = ?';

    pool.query(getImagePathQuery, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const imagePath = results[0].image_path;

        // Send the file located at the image path
        res.sendFile(path.resolve(__dirname, imagePath));
    });
})

module.exports = router