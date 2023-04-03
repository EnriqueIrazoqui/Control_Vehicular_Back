const express = require('express');
const router = express.Router();

const { body, param } = require("express-validator");

const { post_seguros, get_seguros, put_seguros, delete_seguros } = require('../controllers/servicios_controller.js');

router.post('/',
    body('idVehiculo').exists().notEmpty().isNumeric().not().isString(),
    body('descripcion').exists().notEmpty().isString(),
    body('fecha_Hora').exists().notEmpty().isString(),
    body('observaciones').exists().isString(),
    post_seguros);

router.get('/', get_seguros);

router.put('/',
    body('idServicio').exists().notEmpty().isNumeric().not().isString(),
    body('idVehiculo').exists().notEmpty().isNumeric().not().isString(),
    body('descripcion').exists().notEmpty().isString(),
    body('fecha_Hora').exists().notEmpty().isString(),
    body('observaciones').exists().isString(),
    put_seguros);

router.delete('/:idServicio',
    param('idServicio').exists().notEmpty().isNumeric(),
    delete_seguros);

module.exports = router