const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const { response } = require('../app.js');

exports.register = (req,res) => {
    try {
        if (req.body.email && req.body.password) {
            let email = req.body.email

            User.findOne({email}).then(async (response) => {
                if (!response) {
                    let password = await bcrypt.hash(req.body.password,5)

                    let user = new User();
                    user.email = email
                    user.password = password

                    user.save().then(() => {
                        return res.status(200).json({"error":"Success! Your are now a registered user."})
                    }
                    ).catch((err) => {
                        console.log(err)
                        return res.status(500).json({"error":"Registration was unsuccessful though to database error."})
                    })
                }
                else{
                    return res.status(406).json({"error":"Email is already in use!"})
                }
            })           
            .catch((err) => {
                console.log(err)
                return res.status(500).json({"error":"Database error, please try again later."})
            })
        }
        else {
            return res.status(406).json({"error":"Bad input"})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({"error":"Something went wrong, registration aborted."})
    }
}