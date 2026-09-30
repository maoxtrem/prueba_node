const express = require('express');
const controller = require('../controllers/jobs.controller');

const router = express.Router();

router.post('/', controller.create);
router.get('/:id', controller.findOne);

module.exports = router;
