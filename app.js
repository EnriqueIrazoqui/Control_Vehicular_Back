const express = require("express");
const app = express();
require("dotenv").config();

app.listen(process.env.NODE_PORT, () => {
    console.log("server running " + process.env.NODE_PORT);
});

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.use('/automovil', require('./routes/automovil_routes'));
app.use('/refrendos', require('./routes/refrendos_routes'));
