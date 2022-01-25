const router = require('express').Router();
const r = require('rethinkdb');
const bcrypt = require('bcrypt');
let connect = require("../database/connect");

/*
connect().then((connection) => {
    console.log(connection);
})
 */

router.post('/register', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    connect().then((connection) => {
        r.db('contact_tracing').table('users').insert([
            {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            }
        ]).run(connection, function(err, result) {
            if (err) throw err;
            res.send(result);
            console.log(JSON.stringify(result, null, 2));
        })
    })

    //res.send("Hello");
});

module.exports = router;