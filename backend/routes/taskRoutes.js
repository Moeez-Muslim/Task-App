const express = require('express');
const multer = require('multer');
const { uploadTask } = require('../controllers/taskController');
const {getTasks} = require('../controllers/taskController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), uploadTask);
router.get('/', getTasks);

module.exports = router;
