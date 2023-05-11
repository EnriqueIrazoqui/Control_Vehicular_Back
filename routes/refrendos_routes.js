const express = require('express');
const router = express.Router();

const { body, param } = require("express-validator");

const { post_refrendos, get_refrendos, put_refrendos, delete_refrendos } = require('../controllers/refrendos_controller.js');

router.post('/',
    body('idVehiculo').exists().notEmpty().isNumeric().not().isString(),
    body('monto').exists().notEmpty().isString(),
    body('fechaInicio').exists().notEmpty().isDate(),
    body('fechaVencimiento').exists().notEmpty().isDate(),
    post_refrendos);

router.get('/', get_refrendos);

router.put('/',
    body('idRefrendo').exists().notEmpty().isNumeric().not().isString(),
    body('monto').exists().notEmpty().isString(),
    body('fechaInicio').exists().notEmpty().isDate(),
    body('fechaVencimiento').exists().notEmpty().isDate(),
    put_refrendos);

router.delete('/:idRefrendo',
    param('idRefrendo').exists().notEmpty().isNumeric(),
    delete_refrendos);

module.exports = router