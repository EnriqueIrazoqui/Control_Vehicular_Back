const express = require('express');
const axios = require("axios");
const { validationResult } = require('express-validator');
const { return_error } = require('../helpers/helper');
const pool = require('../config/mariadb.js');

const post_verificaciones = async (req, res) => {
    const {idVehiculo, fechaPago, monto, folio} = req.body;

    const validation_errors = validationResult(req);
    if (!validation_errors.isEmpty()) {
        const response = return_error(401, 'datos con formato incorrecto');
        return res.status(401).json(response);
    }

    await pool.getConnection().then( async (conn) => {
        const data = [idVehiculo, fechaPago, monto, folio]
        try{
            const validacion_clave = await conn.query('SELECT count(idVehiculo) as result FROM Vehiculo WHERE idVehiculo = ?', idVehiculo);
            if(parseInt(validacion_clave[0].result) === 0){
                const error = return_error(406, "El vehiculo no existe");
                return res.status(406).json(error);
            }
            const validacion_clave2 = await conn.query('SELECT count(folio) as result FROM Verificaciones WHERE folio = ?', folio);
            if(parseInt(validacion_clave2[0].result) > 0){
                const error = return_error(406, "El folio ya existe");
                return res.status(406).json(error);
            }
            const query = await conn.query("INSERT INTO Verificaciones(idVehiculo, fechaPago, monto, folio) VALUES(?,?,?,?)", data);
            console.log(query);

            const id = await conn.query('SELECT MAX(idVerificacion) as ID FROM Verificaciones');
            
            res.status(200).json({
                'ok': true,
                'idVerificacion': id[0].ID,
                'mensaje': {
                    'statusCode': 200,
                    'menssageText':'La verificacion fue registrada con exito'
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

const get_verificaciones = async (req, res) => {
    await pool.getConnection().then(async (conn) => {
        try {
            const query = await conn.query("SELECT s.idVerificacion, v.idVehiculo, v.marca, v.modelo, v.placas, v.idCampus, s.fechaPago, s.monto, s.folio FROM Verificaciones AS s INNER JOIN Vehiculo AS v ON s.idVehiculo = v.idVehiculo");

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

const put_verificaciones = async (req, res) => {
    const {idVerificacion, idVehiculo, fechaPago, monto, folio} = req.body;

    const validation_errors = validationResult(req);
    if (!validation_errors.isEmpty()) {
        const response = return_error(401, 'datos con formato incorrecto');
        return res.status(401).json(response);
    }

    await pool.getConnection().then( async (conn) => {
        const data = [idVehiculo, fechaPago, monto, folio, idVerificacion]
        try{

            const validacion_clave = await conn.query('SELECT count(idVerificacion) as result FROM Verificaciones WHERE idVerificacion = ?', idVerificacion);
            if(parseInt(validacion_clave[0].result) === 0){
                const error = return_error(406, "La verificacion no existe");
                return res.status(406).json(error);
            }
            const validacion_clave2 = await conn.query('SELECT count(folio) as result FROM Verificaciones WHERE folio = ?', folio);
            if(parseInt(validacion_clave2[0].result) > 0){
                const error = return_error(406, "El folio ya existe");
                return res.status(406).json(error);
            }
            const query = await conn.query("UPDATE Verificaciones SET idVehiculo = ?, fechaPago = ?, monto = ?, folio = ? WHERE idVerificacion = ?", data);
            console.log(query);
            
            res.status(200).json({
                'ok': true,
                'mensaje': {
                    'statusCode': 200,
                    'menssageText':'La verificacion fue actualizada con exito'
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

const delete_verificaciones = async (req, res) => {
    const {idVerificacion} = req.params;

    const validation_errors = validationResult(req);
    if (!validation_errors.isEmpty()) {
        const response = return_error(401, 'datos con formato incorrecto');
        return res.status(401).json(response);
    }

    await pool.getConnection().then( async (conn) => {
        try{
            const validacion_clave = await conn.query('SELECT count(idVerificacion) as result FROM Verificaciones WHERE idVerificacion = ?', idVerificacion);
            if(parseInt(validacion_clave[0].result) === 0){
                const error = return_error(406, "La verificacion no existe");
                return res.status(406).json(error);
            }
            const query = await conn.query("DELETE FROM Verificaciones WHERE idVerificacion = ?", idVerificacion);
            console.log(query);
            
            res.status(200).json({
                'ok': true,
                'mensaje': {
                    'statusCode': 200,
                    'menssageText':'La verificacion fue eliminada con exito'
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
    post_verificaciones,
    get_verificaciones,
    put_verificaciones,
    delete_verificaciones
}