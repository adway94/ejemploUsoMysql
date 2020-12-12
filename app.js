const mysql = require('mysql')
const express = require('express')
const port = 3000

const app = express()

app.use(express.json())

//Conexion
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'unidad4'
})

conexion.connect((error) => {
    if(error) {
        throw error
    }
    console.log('Se establecio correctamente la coneccion a la base de datos')
})

//Desarrollo de programa

/*
Pizzas se puede hacer un programa que hable de pizzas, que sean TIPOS, RESTAURANTES, CLIENTES, PEDIDOS
vemos como es resolvible eso, si es complicado se modifica
*/





//Server
app.listen(port, () => {
    console.log(`El servidor esta presente en el puerto ${port}`)
})