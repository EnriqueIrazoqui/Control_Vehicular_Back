const express = require('express');
const router = express.Router();

const { body, param } = require("express-validator");

const { post_verificaciones, get_verificaciones, put_verificaciones, delete_verificaciones } = require('../controllers/verificaciones_controller.js');

router.post('/',
    body('idVehiculo').exists().notEmpty().isNumeric().not().isString(),
    body('fechaPago').exists().notEmpty().isDate(),
    body('monto').exists().notEmpty().isString(),
    body('folio').exists().notEmpty().isString(),
    post_verificaciones);

router.get('/', get_verificaciones);

router.put('/',
    body('idVerificacion').exists().notEmpty().isNumeric().not().isString(),
    body('idVehiculo').exists().notEmpty().isNumeric().not().isString(),
    body('fechaPago').exists().notEmpty().isDate(),
    body('monto').exists().notEmpty().isString(),
    body('folio').exists().notEmpty().isString(),
    put_verificaciones);

router.delete('/:idVerificacion',
    param('idVerificacion').exists().notEmpty().isNumeric(),
    delete_verificaciones);

module.exports = router