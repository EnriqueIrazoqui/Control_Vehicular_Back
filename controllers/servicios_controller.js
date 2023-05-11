const express = require('express');
const axios = require("axios");
const { validationResult } = require('express-validator');
const { return_error } = require('../helpers/helper');
const pool = require('../config/mariadb.js');

const post_seguros = async (req, res) => {
    const {idVehiculo, descripcion, fecha_Hora, observaciones} = req.body;

    const validation_errors = validationResult(req);
    if (!validation_errors.isEmpty()) {
        const response = return_error(401, 'datos con formato incorrecto');
        return res.status(401).json(response);
    }

    await pool.getConnection().then( async (conn) => {
        const data = [idVehiculo, descripcion, fecha_Hora, observaciones]
        try{
            const validacion_clave = await conn.query('SELECT count(idVehiculo) as result FROM Vehiculo WHERE idVehiculo = ?', idVehiculo);
            if(parseInt(validacion_clave[0].result) === 0){
                const error = return_error(406, "El vehiculo no existe");
                return res.status(406).json(error);
            }
            const query = await conn.query("INSERT INTO Servicios(idVehiculo, descripcion, fecha_Hora, observaciones) VALUES(?,?,?,?)", data);
            console.log(query);

            const id = await conn.query('SELECT MAX(idServicio) as ID FROM Servicios');
            
            res.status(200).json({
                'ok': true,
                'idServicio': id[0].ID,
                'mensaje': {
                    'statusCode': 200,
                    'menssageText':'El servicio fue registrado con exito'
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
            const query = await conn.query("SELECT s.idServicio, v.idVehiculo, v.marca, v.modelo, v.placas, v.idCampus, s.descripcion, s.fecha_Hora, s.observaciones FROM Servicios AS s INNER JOIN Vehiculo AS v ON s.idVehiculo = v.idVehiculo");

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
    const {idServicio, idVehiculo, descripcion, fecha_Hora, observaciones} = req.body;

    const validation_errors = validationResult(req);
    if (!validation_errors.isEmpty()) {
        const response = return_error(401, 'datos con formato incorrecto');
        return res.status(401).json(response);
    }

    await pool.getConnection().then( async (conn) => {
        const data = [idVehiculo, descripcion, fecha_Hora, observaciones, idServicio]
        try{

            const validacion_clave = await conn.query('SELECT count(idServicio) as result FROM Servicios WHERE idServicio = ?', idServicio);
            if(parseInt(validacion_clave[0].result) === 0){
                const error = return_error(406, "El servicio no existe");
                return res.status(406).json(error);
            }
            const query = await conn.query("UPDATE Servicios SET idVehiculo = ?, descripcion = ?, fecha_Hora = ?, observaciones = ? WHERE idServicio = ?", data);
            console.log(query);
            
            res.status(200).json({
                'ok': true,
                'mensaje': {
                    'statusCode': 200,
                    'menssageText':'El servicio fue actualizado con exito'
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
    const {idServicio} = req.params;

    const validation_errors = validationResult(req);
    if (!validation_errors.isEmpty()) {
        const response = return_error(401, 'datos con formato incorrecto');
        return res.status(401).json(response);
    }

    await pool.getConnection().then( async (conn) => {
        try{
            const validacion_clave = await conn.query('SELECT count(idServicio) as result FROM Servicios WHERE idServicio = ?', idServicio);
            if(parseInt(validacion_clave[0].result) === 0){
                const error = return_error(406, "El servicio no existe");
                return res.status(406).json(error);
            }
            const query = await conn.query("DELETE FROM Servicios WHERE idServicio = ?", idServicio);
            console.log(query);
            
            res.status(200).json({
                'ok': true,
                'mensaje': {
                    'statusCode': 200,
                    'menssageText':'El servicio fue eliminado con exito'
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