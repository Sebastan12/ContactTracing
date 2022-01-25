const express = require('express');
const r = require('rethinkdb');
const routes = require('./routes/routes');

const app = express();
const port = 8000;

app.use(express.json());
app.use('/api', routes);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
