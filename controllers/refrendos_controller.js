const express = require('express');
const axios = require("axios");
const { validationResult } = require('express-validator');
const { return_error } = require('../helpers/helper');
const pool = require('../config/mariadb.js');

const post_refrendos = async (req, res) => {
    const {idVehiculo, monto, fechaInicio, fechaVencimiento} = req.body;

    const validation_errors = validationResult(req);
    if (!validation_errors.isEmpty()) {
        const response = return_error(401, 'datos con formato incorrecto');
        return res.status(401).json(response);
    }

    await pool.getConnection().then( async (conn) => {
        const data = [idVehiculo, monto, fechaInicio, fechaVencimiento]
        try{
            const validacion_clave = await conn.query('SELECT count(idVehiculo) as result FROM Vehiculo WHERE idVehiculo = ?', idVehiculo);
            if(parseInt(validacion_clave[0].result) === 0){
                const error = return_error(406, "El vehiculo no existe");
                return res.status(406).json(error);
            }
            const query = await conn.query("INSERT INTO Refrendos(idVehiculo, monto, fechaInicio, fechaVencimiento) VALUES(?,?,?,?)", data);
            console.log(query);

            const id = await conn.query('SELECT MAX(idRefrendo) as ID FROM Refrendos');
            
            res.status(200).json({
                'ok': true,
                'idVehiculo': id[0].ID,
                'mensaje': {
                    'statusCode': 200,
                    'menssageText':'El refrendo fue registrado con exito'
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

const get_refrendos = async (req, res) => {
    await pool.getConnection().then(async (conn) => {
        try {
            const query = await conn.query("SELECT r.idRefrendo, v.idVehiculo, v.marca, v.modelo, v.placas, v.idCampus, r.monto, r.fechaInicio, r.fechaVencimiento FROM Refrendos AS r INNER JOIN Vehiculo AS v ON r.idVehiculo = v.idVehiculo");

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

const put_refrendos = async (req, res) => {
    const {idRefrendo, monto, fechaInicio, fechaVencimiento} = req.body;

    const validation_errors = validationResult(req);
    if (!validation_errors.isEmpty()) {
        const response = return_error(401, 'datos con formato incorrecto');
        return res.status(401).json(response);
    }

    await pool.getConnection().then( async (conn) => {
        const data = [monto, fechaInicio, fechaVencimiento, idRefrendo]
        try{

            const validacion_clave = await conn.query('SELECT count(idRefrendo) as result FROM Refrendos WHERE idRefrendo = ?', idRefrendo);
            if(parseInt(validacion_clave[0].result) === 0){
                const error = return_error(406, "El refrendo no existe");
                return res.status(406).json(error);
            }
            const query = await conn.query("UPDATE Refrendos SET monto = ?, fechaInicio = ?, fechaVencimiento = ? WHERE idRefrendo = ?", data);
            console.log(query);
            
            res.status(200).json({
                'ok': true,
                'mensaje': {
                    'statusCode': 200,
                    'menssageText':'El refrendo fue actualizado con exito'
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

const delete_refrendos = async (req, res) => {
    const {idRefrendo} = req.params;

    const validation_errors = validationResult(req);
    if (!validation_errors.isEmpty()) {
        const response = return_error(401, 'datos con formato incorrecto');
        return res.status(401).json(response);
    }

    await pool.getConnection().then( async (conn) => {
        try{
            const validacion_clave = await conn.query('SELECT count(idRefrendo) as result FROM Refrendos WHERE idRefrendo = ?', idRefrendo);
            if(parseInt(validacion_clave[0].result) === 0){
                const error = return_error(406, "El refrendo no existe");
                return res.status(406).json(error);
            }
            const query = await conn.query("DELETE FROM Refrendos WHERE idRefrendo = ?", idRefrendo);
            console.log(query);
            
            res.status(200).json({
                'ok': true,
                'mensaje': {
                    'statusCode': 200,
                    'menssageText':'El refrendo fue eliminado con exito'
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
    post_refrendos,
    get_refrendos,
    put_refrendos,
    delete_refrendos
}