// Declaracion de Variables
const express = require('express'); 
const mysql = require(`mysql`);
const cors = require('cors');
const app = express();

//establecemos el usa del formato Json para probar la base de  datos desde Posrman
app.use(express.json());
app.use(cors());

//se establecen los parametros de conexion
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'sqluser',
    password: 'password',
    database: 'bdclientes'
});

//prueba de conexion
conexion.connect(function (error) {
    if (error) {
        throw error;
    } else {
        console.log("Se ha conectado de forma correcta a la Base de Datos ");
    }
});

// Mensaje a la pagina de conexion
app.get(`/`, function (req, res) {
    res.send("Puerto de entrada al servidor conectado con exito")
});

//Mostrar todos los clientes

app.get('/api/clientes', (req, res) => {
    conexion.query('SELECT * FROM  clientes', (error, filas) => {
        if (error) {
            throw error;
        } else {
            res.send(filas);
        }
    })
});


// Mostrar cliente por ID
app.get('/api/clientes/:id', (req, res) => {
    conexion.query('SELECT * FROM  clientes WHERE _id = ?', [req.params.id], (error, fila) => {
        if (error) {
            throw error;
        } else {
            res.send(fila);
        }
    })
});

//  Agregar 

app.post('/api/clientes', (req, res) => {
    let data = { Nombre: req.body.Nombre, Apellido: req.body.Apellido, tipo: req.body.tipo, Rut: req.body.Rut, Tlf: req.body.Tlf };
    let sql = "INSERT INTO clientes SET ?";
    conexion.query(sql, data, function (error, results) {
        if (error) {
            throw error;
        } else {
            res.send(results);
        }
    });
});

// Editar 

app.put('/api/clientes/:id', (req, res) => {
    let id = req.params.id;
    let Nombre = req.body.Nombre;
    let Apellido = req.body.Apellido;
    let Rut = req.body.Rut;
    let Tlf = req.body.Tlf;
    let tipo = req.body.tipo;
    let sql = "UPDATE clientes SET Nombre= ?, Apellido=?, Rut=?, Tlf=?, tipo=? WHERE _id = ?";

    conexion.query(sql, [Nombre, Apellido, Rut, Tlf, tipo, id], function (error, results) {
        if (error) {
            throw error;
        } else {
            res.send(results);
        }
    });
});

// Borrar

app.delete('/api/clientes/:id', (req, res)=>{
    conexion.query('DELETE FROM  clientes WHERE _id = ?', [req.params.id], (error, filas) => {
        if (error) {
            throw error;
        } else {
            res.send(filas);
        }
    });
});


const puerto = process.env.PUERTO || 3060;

app.listen(puerto, function () {
    console.log("Servidor conectado al puerto :" + puerto)
});
