const express = require('express');
const bodyParser = require('body-parser');
const app = express();
global.config = require('./config');
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cookieParser())
app.use(cors({
    credential: true,
    origin: ['http://localhost:4200']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', require('./controllers')); //routes which don't require token authentication should be placed here
//app.use(require('./middleware/tokenValidator')); //middleware to authenticate token
//app.use('/api', require('./controllers/account')); //Apis to protect and use token should be placed here

app.listen(config.port,function() {
    console.log("Listening at Port http://localhost:"+config.port);
});