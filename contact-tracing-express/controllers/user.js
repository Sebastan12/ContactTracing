const express = require('express');
const router = express.Router();
const db = require('../models/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function hashPassword(password){
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

router.post('/',async (req,res) => {
    const hashedPassword = await hashPassword(req.body.password);
    //Create new User.
    let data = {
        username : req.body.username,
        password : hashedPassword
    };
    let model = new db();
    //Check if user already exists
    model.findUser(req.body.username,function(error,response) {
        if (error) {
            return res.status(500).send({ message: error});
        }
        if (response) {
            return res.status(409).send({message: "User Already Exists"});
        }
        //Create new user
        model.addNewUser(data,function(error,response) {
            if(error) {
                return res.status(500).send({message : error})
            }
            res.send({message : "Added new user"});
        });
    });
});

router.get('/',function (req,res) {
    try{
        const cookie = req.cookies['jwt'];

        if(!cookie){
            return res.status(401).send({
                message: 'unauthenticated'
            })
        }

        const claims = jwt.verify(cookie, global.config.secret);

        if(!claims){
            return res.status(401).send({
                message: 'unauthenticated'
            })
        }
        let model = new db();
        model.findUserById(claims.id,async (error,response) => {
            if(error) {
                return res.status(500).send({message : error});
            }
            if(!response) {
                return res.status(404).send({message : "User not found"});
            }

            delete response['password'];
            res.send(response);
        });
    }catch (e){
        return res.status(401).send({
            message: 'unauthenticated'
        })
    }

});

router.post('/login',async(req,res) => {
    let model = new db();
    const hashedPassword = await hashPassword(req.body.password);
    //perform user login
    model.findUser(req.body.username,async (error,response) => {
        if(error) {
            return res.status(500).send({message : error});
        }
        if(!response) {
            return res.status(404).send({message : "User not found"});
        }
        if(!await bcrypt.compare(req.body.password, response.password)) {
            return res.status(401).send({message : "Wrong Password"});
        }
        let token = jwt.sign({"id" : response.id}, global.config.secret, {
            expiresIn: 1440 // expires in 1 hours
        });

        //httponly to prevent cros-site scripting attacks
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 1440
        });

        res.send({message: 'Validation successful!'});
    });
});

router.post('/logout',function (req,res) {
    res.cookie('jwt', val='', {maxAge: 0});

    res.send({message: 'success'});
});
module.exports = router;