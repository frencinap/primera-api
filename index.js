const express = require('express')
const app = express()
const { v4 } = require('uuid')
const moment = require('moment')
const fs = require('fs')

app.listen(3000, console.log('servidor en http://localhost:3000'))

app.use(express.json())

app.get('/productos', (req,res)=> {
    res.setHeader('content-type', 'application/json')
    res.sendFile(`${__dirname}/data/productos.json`)
})

//busqueda por id(find)
app.get('/productos/:id', (req,res) => {
    res.setHeader('content-type', 'application/json');
    let id = req.params.id;
    let contenido = fs.readFileSync(`${__dirname}/data/productos.json`, "utf8");
    contenido = JSON.parse(contenido);
    let producto = contenido.productos.find(i => i.id == id);
    producto ? res.send(producto) : res.status(404).send({ error: "producto no existe"});
})

//agregar
app.post('/productos', (req,res)=> {
    res.setHeader('content-type', 'application/json');
    let {nombre, precio } = req.body;
    let id = v4().slice(0,8);
    let producto = { id,nombre, precio }
    let contenido = fs.readFileSync(`${__dirname}/data/productos.json`, "utf8");
    contenido = JSON.parse(contenido);
    contenido.productos.push(producto);
    contenido.ultima_actualizacion = moment().format("YYYY-MM-DD HH:mm:ss");
    contenido = JSON.stringify(contenido, null, 2);
    fs.writeFileSync(`${__dirname}/data/productos.json`,contenido, "utf8");
    res.json({message: "producto registrado"})
})

//editar
app.put('/productos', (req,res)=> {
    res.setHeader('content-type', 'application/json');
    let {id, nombre, precio } = req.body;
    let contenido = fs.readFileSync(`${__dirname}/data/productos.json`, "utf8");
    contenido = JSON.parse(contenido);
    contenido.productos.map( p => {
        if(p.id == id ){
            p.nombre = nombre;
            p.precio = precio
        }
        return p
    })
    contenido.ultima_actualizacion = moment().format("YYYY-MM-DD HH:mm:ss");
    contenido = JSON.stringify(contenido, null, 2);
    fs.writeFileSync(`${__dirname}/data/productos.json`,contenido, "utf8");
    res.json({message: "producto modificado"})
})

//eliminar
app.delete('/productos/:id', (req,res)=> {
    let id = req.params.id;
    let contenido = JSON.parse(fs.readFileSync(`${__dirname}/data/productos.json`, "utf8"));
    let productosActualizados = contenido.productos.filter( p => p.id != id);
    contenido.productos = productosActualizados;
    contenido.ultima_actualizacion = moment().format("YYYY-MM-DD HH:mm:ss");
    contenido = JSON.stringify(contenido, null, 2);
    fs.writeFileSync(`${__dirname}/data/productos.json`,contenido, "utf8");
    res.json({message: "producto eliminado"})
})