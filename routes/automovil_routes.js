const express = require('express');
const router = express.Router();

const { body } = require("express-validator");

const { post_automovil, get_automovil, put_automovil, delete_automovil } = require('../controllers/automovil_controller.js');

router.post('/', post_automovil);

router.get('/', get_automovil);

router.put('/', put_automovil);

router.delete('/', delete_automovil);

module.exports = router