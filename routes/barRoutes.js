const express = require('express');
const { searchBars, attendBar } = require('../controllers/barController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', searchBars);
router.post('/:id/attend', verifyToken, attendBar);

module.exports = router;
