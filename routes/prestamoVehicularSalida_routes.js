const express = require('express');
const router = express.Router();

const { body, param } = require("express-validator");

const { post_PrestamoVehicularSalida, get_PrestamoVehicularSalida, put_PrestamoVehicularSalida, delete_PrestamoVehicularSalida } = require('../controllers/prestamoVehicularSalida_controller.js');

router.post('/',
    body('idSupervisor').exists().notEmpty().isString(),
    body('idUsuario').exists().notEmpty().isString(),
    body('idVehiculo').exists().notEmpty().isNumeric().not().isString(),
    body('kilometraje').exists().notEmpty().isString(),
    body('descripcionDanos').exists().notEmpty().isString(),
    body('tapetes').exists().notEmpty().isNumeric().not().isString(),
    body('llantasDeRefaccion').exists().notEmpty().isNumeric().not().isString(),
    body('gatoHidraulico').exists().notEmpty().isNumeric().not().isString(),
    body('extras').exists().isString(),
    body('nivelDeCombustible').exists().notEmpty().isString(),
    body('fechaHora').exists().notEmpty().isDate(),
    body('foto').exists().notEmpty().isString(),
    post_PrestamoVehicularSalida);

router.get('/', get_PrestamoVehicularSalida);

router.put('/',
    body('id').exists().notEmpty().isNumeric().not().isString(),
    body('idSupervisor').exists().notEmpty().isString(),
    body('idUsuario').exists().notEmpty().isString(),
    body('idVehiculo').exists().notEmpty().isNumeric().not().isString(),
    body('kilometraje').exists().notEmpty().isString(),
    body('descripcionDanos').exists().notEmpty().isString(),
    body('tapetes').exists().notEmpty().isNumeric().not().isString(),
    body('llantasDeRefaccion').exists().notEmpty().isNumeric().not().isString(),
    body('gatoHidraulico').exists().notEmpty().isNumeric().not().isString(),
    body('extras').exists().isString(),
    body('nivelDeCombustible').exists().notEmpty().isString(),
    body('fechaHora').exists().notEmpty().isDate(),
    body('foto').exists().notEmpty().isString(),
    put_PrestamoVehicularSalida);

router.delete('/:id',
    param('id').exists().notEmpty().isNumeric(),
    delete_PrestamoVehicularSalida);

module.exports = router