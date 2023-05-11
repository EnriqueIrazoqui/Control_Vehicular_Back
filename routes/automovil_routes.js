const express = require('express');
const router = express.Router();

const { body, param } = require("express-validator");

const { post_automovil, get_automovil, get_automovilByPlacas, put_automovil, delete_automovil } = require('../controllers/automovil_controller.js');

router.post('/',
    body('idCampus').exists().notEmpty().isString(),
    body('marca').exists().notEmpty().isString(),
    body('modelo').exists().notEmpty().isString(),
    body('placas').exists().notEmpty().isString(),
    body('color').exists().notEmpty().isString(),
    body('serie').exists().notEmpty().isString(),
    body('tipoCombustible').exists().notEmpty().isString(),
    post_automovil);

router.get('/', get_automovil);

router.get('/:placas',
    param('placas').exists().notEmpty().isString(),
    get_automovilByPlacas);

router.put('/',
    body('idVehiculo').exists().notEmpty().isNumeric().not().isString(),
    body('idCampus').exists().notEmpty().isString(),
    body('marca').exists().notEmpty().isString(),
    body('modelo').exists().notEmpty().isString(),
    body('placas').exists().notEmpty().isString(),
    body('color').exists().notEmpty().isString(),
    body('serie').exists().notEmpty().isString(),
    body('tipoCombustible').exists().notEmpty().isString(),
    put_automovil);

router.delete('/:idVehiculo',
    param('idVehiculo').exists().notEmpty().isNumeric(),
    delete_automovil);

module.exports = router