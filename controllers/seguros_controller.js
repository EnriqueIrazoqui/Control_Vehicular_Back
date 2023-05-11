const express = require('express');
const axios = require("axios");
const { validationResult } = require('express-validator');
const { return_error } = require('../helpers/helper');
const pool = require('../config/mariadb.js');

const post_seguros = async (req, res) => {
    const {idVehiculo, numeroSeguro, nombreAseguradora, fechaInicio, fechaVencimiento} = req.body;

    const validation_errors = validationResult(req);
    if (!validation_errors.isEmpty()) {
        const response = return_error(401, 'datos con formato incorrecto');
        return res.status(401).json(response);
    }

    await pool.getConnection().then( async (conn) => {
        const data = [idVehiculo, numeroSeguro, nombreAseguradora, fechaInicio, fechaVencimiento]
        try{
            const validacion_clave = await conn.query('SELECT count(idVehiculo) as result FROM Vehiculo WHERE idVehiculo = ?', idVehiculo);
            if(parseInt(validacion_clave[0].result) === 0){
                const error = return_error(406, "El vehiculo no existe");
                return res.status(406).json(error);
            }
            const query = await conn.query("INSERT INTO Seguro(idVehiculo, numeroSeguro, nombreAseguradora, fechaInicio, fechaVencimiento) VALUES(?,?,?,?,?)", data);
            console.log(query);

            const id = await conn.query('SELECT MAX(idSeguro) as ID FROM Seguro');
            
            res.status(200).json({
                'ok': true,
                'idVehiculo': id[0].ID,
                'mensaje': {
                    'statusCode': 200,
                    'menssageText':'El seguro fue registrado con exito'
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

const get_seguros = async (req, res) => {
    await pool.getConnection().then(async (conn) => {
        try {
            const query = await conn.query("SELECT s.idSeguro, v.idVehiculo, v.marca, v.modelo, v.placas, v.idCampus, s.numeroSeguro, s.nombreAseguradora, s.fechaInicio, s.fechaVencimiento FROM Seguro AS s INNER JOIN Vehiculo AS v ON s.idVehiculo = v.idVehiculo");

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

const put_seguros = async (req, res) => {
    const {idSeguro, numeroSeguro, nombreAseguradora, fechaInicio, fechaVencimiento} = req.body;

    const validation_errors = validationResult(req);
    if (!validation_errors.isEmpty()) {
        const response = return_error(401, 'datos con formato incorrecto');
        return res.status(401).json(response);
    }

    await pool.getConnection().then( async (conn) => {
        const data = [numeroSeguro, nombreAseguradora, fechaInicio, fechaVencimiento, idSeguro]
        try{

            const validacion_clave = await conn.query('SELECT count(idSeguro) as result FROM Seguro WHERE idSeguro = ?', idSeguro);
            if(parseInt(validacion_clave[0].result) === 0){
                const error = return_error(406, "El seguro no existe");
                return res.status(406).json(error);
            }
            const query = await conn.query("UPDATE Seguro SET numeroSeguro = ?, nombreAseguradora = ?, fechaInicio = ?, fechaVencimiento = ? WHERE idSeguro = ?", data);
            console.log(query);
            
            res.status(200).json({
                'ok': true,
                'mensaje': {
                    'statusCode': 200,
                    'menssageText':'El seguro fue actualizado con exito'
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

const delete_seguros = async (req, res) => {
    const {idSeguro} = req.params;

    const validation_errors = validationResult(req);
    if (!validation_errors.isEmpty()) {
        const response = return_error(401, 'datos con formato incorrecto');
        return res.status(401).json(response);
    }

    await pool.getConnection().then( async (conn) => {
        try{
            const validacion_clave = await conn.query('SELECT count(idSeguro) as result FROM Seguro WHERE idSeguro = ?', idSeguro);
            if(parseInt(validacion_clave[0].result) === 0){
                const error = return_error(406, "El seguro no existe");
                return res.status(406).json(error);
            }
            const query = await conn.query("DELETE FROM Seguro WHERE idSeguro= ?", idSeguro);
            console.log(query);
            
            res.status(200).json({
                'ok': true,
                'mensaje': {
                    'statusCode': 200,
                    'menssageText':'El seguro fue eliminado con exito'
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
    post_seguros,
    get_seguros,
    put_seguros,
    delete_seguros
}