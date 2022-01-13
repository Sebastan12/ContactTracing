const express = require('express');
const app = express();
const port: number = 8000;

app.get('/', (req, res)=>{
    res.send("Hello")
})

app.listen(port)