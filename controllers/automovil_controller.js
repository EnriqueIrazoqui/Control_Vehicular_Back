const express = require('express');
const axios = require("axios");
const { validationResult } = require('express-validator');
const { return_error } = require('../helpers/helper');
const pool = require('../config/mariadb.js');

function buscarUnidad(id) {
    return new Promise((resolve, reject) => {
        // Hacemos una consulta GET al endpoint para obtener la información completa de la tabla "unidad"
        axios.get('http://developer.tecmm.mx:3322/v1/unidad')
            .then(responsee => {
                // Buscamos el id en los datos recibidos
                const unidad = responsee.data.find(unidad => unidad.idUnidad === id);
                // Si el id existe, resolvemos la promesa con la información de la unidad correspondiente
                if (unidad) {
                    resolve(unidad.idUnidad);
                } else {
                    resolve(null);
                }
            })
            .catch(error => reject(error));
            
    });
}

const post_automovil = async (req, res) => {
    const {idCampus, marca, modelo, placas, color, serie, tipoCombustible} = req.body;

    const validation_errors = validationResult(req);
    if (!validation_errors.isEmpty()) {
        const response = return_error(401, 'datos con formato incorrecto');
        return res.status(401).json(response);
    }

    await pool.getConnection().then( async (conn) => {
        const data = [idCampus, marca, modelo, placas, color, serie, tipoCombustible]
        try{
            const valor = await buscarUnidad(idCampus);
            if (valor === null) {
                const error = return_error(406, "La unidad no existe");
                return res.status(406).json(error);
            }
            const query = await conn.query("INSERT INTO Vehiculo(idCampus, marca, modelo, placas, color, serie, tipoCombustible) VALUES(?,?,?,?,?,?,?)", data);
            console.log(query);

            const id = await conn.query('SELECT MAX(idVehiculo) as ID FROM Vehiculo');
            
            res.status(200).json({
                'ok': true,
                'idVehiculo': id[0].ID,
                'mensaje': {
                    'statusCode': 200,
                    'menssageText':'El vehiculo fue registrado con exito'
                }
            })
            conn.end();
        }catch(error){
            res.status(500).json({
                "ok": false,
                "message": {
                    "statusCode": 500,
                    "messageText": "internal server error"
                }
            })
            conn.end();
        }
    });
}

const get_automovil = async (req, res) => {
    await pool.getConnection().then(async (conn) => {
        try {
            const query = await conn.query("SELECT * FROM Vehiculo");

            res.json(query);
            conn.end();
        } catch (error) {
            res.status(500).json({
                "ok": false,
                "message": {
                    "statusCode": 500,
                    "messageText": "internal server error"
                }
            })
            conn.end();
        }
    });
}

const get_automovilByPlacas = async (req, res) => {
    const {placas} = req.params;

    const validation_errors = validationResult(req);
    if (!validation_errors.isEmpty()) {
        const response = return_error(401, 'datos con formato incorrecto');
        return res.status(401).json(response);
    }

    await pool.getConnection().then( async (conn) => {
        try{
            const validacion_clave = await conn.query('SELECT count(placas) as result FROM Vehiculo WHERE placas = ?', placas);
            if(parseInt(validacion_clave[0].result) === 0){
                const error = return_error(406, "El vehiculo no existe");
                return res.status(406).json(error);
            }
            const query = await conn.query("SELECT * FROM Vehiculo WHERE placas = ?", placas);
            console.log(query);

            res.json(query);
            conn.end();
        }catch(error){
            res.status(500).json({
                "ok": false,
                "message": {
                    "statusCode": 500,
                    "messageText": "internal server error"
                }
            })
            conn.end();
        }
    });
}

const put_automovil = async (req, res) => {
    const {idVehiculo, idCampus, marca, modelo, placas, color, serie, tipoCombustible} = req.body;

    const validation_errors = validationResult(req);
    if (!validation_errors.isEmpty()) {
        const response = return_error(401, 'datos con formato incorrecto');
        return res.status(401).json(response);
    }

    await pool.getConnection().then( async (conn) => {
        const data = [idCampus, marca, modelo, placas, color, serie, tipoCombustible, idVehiculo]
        try{
            const valor = await buscarUnidad(idCampus);
            if (valor === null) {
                const error = return_error(406, "La unidad no existe");
                return res.status(406).json(error);
            }

            const validacion_clave = await conn.query('SELECT count(idVehiculo) as result FROM Vehiculo WHERE idVehiculo = ?', idVehiculo);
            if(parseInt(validacion_clave[0].result) === 0){
                const error = return_error(406, "El vehiculo no existe");
                return res.status(406).json(error);
            }
            const query = await conn.query("UPDATE Vehiculo SET idCampus = ?, marca = ?, modelo = ?, placas = ?, color = ?, serie = ?, tipoCombustible = ? WHERE idVehiculo = ?", data);
            console.log(query);
            
            res.status(200).json({
                'ok': true,
                'mensaje': {
                    'statusCode': 200,
                    'menssageText':'El vehiculo fue actualizado con exito'
                }
            })
            conn.end();
        }catch(error){
            res.status(500).json({
                "ok": false,
                "message": {
                    "statusCode": 500,
                    "messageText": "internal server error"
                }
            })
            conn.end();
        }
    });
}

const delete_automovil = async (req, res) => {
    const {idVehiculo} = req.params;

    const validation_errors = validationResult(req);
    if (!validation_errors.isEmpty()) {
        const response = return_error(401, 'datos con formato incorrecto');
        return res.status(401).json(response);
    }

    await pool.getConnection().then( async (conn) => {
        try{
            const validacion_clave = await conn.query('SELECT count(idVehiculo) as result FROM Vehiculo WHERE idVehiculo = ?', idVehiculo);
            if(parseInt(validacion_clave[0].result) === 0){
                const error = return_error(406, "El vehiculo no existe");
                return res.status(406).json(error);
            }
            const query = await conn.query("DELETE FROM Vehiculo WHERE idVehiculo = ?", idVehiculo);
            console.log(query);
            
            res.status(200).json({
                'ok': true,
                'mensaje': {
                    'statusCode': 200,
                    'menssageText':'El vehiculo fue eliminado con exito'
                }
            })
            conn.end();
        }catch(error){
            res.status(500).json({
                "ok": false,
                "message": {
                    "statusCode": 500,
                    "messageText": "internal server error"
                }
            })
            conn.end();
        }
    });
}

module.exports = {
    post_automovil,
    get_automovil,
    get_automovilByPlacas,
    put_automovil,
    delete_automovil
}