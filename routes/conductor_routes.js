const express = require('express');
const router = express.Router();

const { body } = require("express-validator");

const { post_conductor, get_conductor, put_conductor, delete_conductor } = require('../controllers/conductor_controller.js');

router.post('/', post_conductor);

router.get('/', get_conductor);

router.put('/', put_conductor);

router.delete('/', delete_conductor);

module.exports = router