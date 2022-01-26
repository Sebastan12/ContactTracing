const express = require('express');
const router = express.Router();
const db = require('../models/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
        model.getAllEntriesOfUser(claims.id,async (error,response) => {
            if(error) {
                return res.status(500).send({message : error});
            }
            if(!response) {
                return res.status(404).send({message : "User not found"});
            }

            res.send(await response);
        });
    }catch (e){
        return res.status(401).send({
            message: 'unauthenticated'
        })
    }

});

router.get('/:uid',function (req,res) {

    let model = new db();
    model.findEntryById(req.params.uid,async (error,response) => {
        if(error) {
            return res.status(500).send({message : error});
        }
        if(!response) {
            return res.status(404).send({message : "Entry not found"});
        }

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
            model.findUserById(claims.id,async (error,response_user) => {
                if(error) {
                    return res.status(500).send({message : error});
                }
                if(!response_user) {
                    return res.status(404).send({message : "User not found"});
                }
            });
            if(! (response.parent_id === claims.id)){
                delete response['parent_id'];
            }
            res.send(await response);
        }catch (e){
            delete response['parent_id'];
            res.send(await response);
        }


    });


});

router.post('/',async (req,res) => {
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

            let data = {
                parent_id: response.id,
                name: req.body.name,
                address: req.body.address
            };
            let model = new db();
            //Check if user already exists
            //Create new user
            model.addNewEntry(data,function(error,response) {
                    if(error) {
                        return res.status(500).send({message : error})
                    }
                    res.send({message : "Added new entry"});
                });
            });
    }catch (e){
        return res.status(401).send({
            message: 'unauthenticated'
        })
    }
});
module.exports = router;