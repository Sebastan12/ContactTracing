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
            return res.json({"error": true, "message": error});
        }
        if (response) {
            return res.json({"error": true, "message": "User Already Exists"});
        }
        //Create new user
        model.addNewUser(data,function(error,response) {
            if(error) {
                return res.json({"error" : true,"message" : error})
            }
            res.json({"error" : false,"message" : "Added new user"});
        });
    });
});

router.post('/login',async(req,res) => {
    let model = new db();
    const hashedPassword = await hashPassword(req.body.password);
    //perform user login
    model.findUser(req.body.username,async (error,response) => {
        if(error) {
            return res.json({"error" : true,"message" : error});
        }
        if(!response) {
            return res.json({"error" : true,"message" : "User not found"});
        }
        if(!await bcrypt.compare(req.body.password, response.password)) {
            return res.json({"error" : true,"message" : "Password mismatch"});
        }
        console.log(response.id);
        let token = jwt.sign({"id" : response.id}, global.config.secret, {
            expiresIn: 1440 // expires in 1 hours
        });

        //httponly to prevent cros-site scripting attacks
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 1440
        });

        res.json({
            error: false,
            message: 'Validation successful!'
        });
    });
});
module.exports = router;