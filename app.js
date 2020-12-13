const mysql = require('mysql')
const express = require('express')
const util = require('util')
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

const qy = util.promisify(conexion.query).bind(conexion) //Permite uso de async / await

//Desarrollo de programa

/*
Pizzas se puede hacer un programa que hable de pizzas, que sean TIPOS, RESTAURANTES, CLIENTES, PEDIDOS
vemos como es resolvible eso, si es complicado se modifica
*/

/* 
GET para obtener las Pizzas
GET id para obtener 1 pizza del id
POST para generar una pizza nueva
PUT para modificar la pizza
DELETE para borrar una pizza
*/

/* 
GET para obtener las Restaurants
GET id para obtener 1 Restaurant del id
POST para generar una Restaurant nueva
PUT para modificar la Restaurant
DELETE para borrar una Restaurant
*/
//Restaurants
app.get('/restaurants', async (req, res) => {
    try{
        const query = 'SELECT * FROM restaurant'
        const respuesta = await qy(query)
        res.send({'Respuesta': respuesta})
    }
    catch(e){
        console.error(e.message)
        res.status(413).send({'Error': e.message})
    }
})

app.get('/restaurants/:id', async (req,res) =>{
    try{
        const query = 'SELECT * FROM restaurant WHERE id = ?'
        const respuesta = await qy(query,[req.params.id])
        res.send({'Respuesta': respuesta})
    }
    catch(e){
        console.error(e.message)
        res.status(413).send({'Error': e.message})
    }
})

app.post('/restaurants', async (req, res) => {
    try{
        if(!req.body.nombre){
            throw new Error('Falta enviar nombre')
        }
        let query = 'SELECT * FROM restaurant WHERE nombre = ?'

        let respuesta = await qy(query,[req.body.nombre])
        
        if(respuesta.length > 0 ) {
            throw new Error('Ese restaurant ya existe')
        }

        query = 'INSERT INTO restaurant (nombre) VALUE (?)'
        respuesta = await qy(query, [req.body.nombre])

        res.send({'ID': respuesta.insertId})
    }
    catch(e){
        console.error(e.message)
        res.status(413).send({'Error': e.message})
    }
})

app.put('/restaurants/:id', async (req, res) => {
    try {
        if(!req.body.nombre){
            throw new Error('No enviaste el nombre')
        }

        let query = 'SELECT * FROM restaurant WHERE nombre = ? AND id <> ?'
        let respuesta = await qy(query, [req.body.nombre, req.params.id])

        if(respuesta > 0){
            throw new Error('El nombre del restaurant ya existe')
        }

        query = 'UPDATE restaurant SET nombre = ? WHERE id = ?'
        respuesta = await qy(query, [req.body.nombre, req.params.id])

        res.send({"Respuesta":respuesta})
    }
    catch(e){
        console.error(e.message)
        res.status(413).send({'Error': e.message})
    }
})

app.delete('/restaurants/:id', async(req, res) =>{
    try {
        let query = 'SELECT * FROM restaurant WHERE pedido_id = ?'
        let respuesta = await qy(query, [req.params.id])

        if(respuesta.length > 0){
            throw new Error('Este Restaurant tiene pedidos asociados no se puede borrar')
        }

        query = 'DELETE FROM restaurant WHERE id = ?'
        respuesta = await qy(query, [req.params.id])

        res.send({"Respuesta":respuesta})
        
    }
    catch(e){
        console.error(e.message)
        res.status(413).send({'Error': e.message})
    }
})

//Pizzas





//Server
app.listen(port, () => {
    console.log(`El servidor esta presente en el puerto ${port}`)
})