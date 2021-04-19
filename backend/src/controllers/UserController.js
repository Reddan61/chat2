const {sendEmail} = require("../utils/sendEmail");
const mongoose = require("mongoose");
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const {UserModel} = require("../models/UserModel");
const {generateMD5} = require("../utils/generateHash");


class UserController {
    async index(req, res) {
        try {
            const users = await UserModel.find({}).exec();

            res.json({
                status: "success",
                data: users
            })

        } catch (e) {
            res.status(500).json({
                status: 'error',
                message: JSON.stringify(e)
            })
        }
    }

    async show(req,res){
        const userId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).send();
            return
        }
    
        const user = await UserModel.findById(userId);

        if(!user) {
            res.status(404).json({
                status:"error",
                message:"User isn't found"
            })
            return
        } else {
            res.json({
                status:"success",
                data:user
            })
        }
        
    }

    async create(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                res.status(400).json({status: "error", errors: errors.array()});
                return;
            }

            const data = {
                email: req.body.email,
                username: req.body.username,
                password: generateMD5(req.body.password + process.env.SECRET_KEY),
                confirmHash: generateMD5(process.env.SECRET_KEY || Math.random().toString())
            };

            const user = await UserModel.create(data);

            sendEmail({
                emailFrom: 'admin@chat.ru',
                emailTo: data.email,
                subject: "Verify your email address Chat",
                html: `Please verify your email address by clicking this
<a href="http://localhost:${process.env.PORT || 8888}/auth/verify?hash=${data.confirmHash}">link</a>`
            },(err) => {
                if(err) {
                    res.status(500).json({
                        status:"error",
                        message: JSON.stringify(err)
                    })
                } else {
                    res.status(201).json({
                        status: "success",
                        data: user
                    });
                }
            })


        } catch (e) {
            res.status(500).json({
                status: 'error',
                message: e
            })
        }
    }


    async verify(req,res) {
        try{
            const hash = req.query.hash;
            if(!hash) {
                res.status(400).send();
                return
            }
            const user = await UserModel.findOne({confirmHash : hash}).exec();
            
            if(user) {
                user.confirmed = true;
                user.save();
    
                res.json({
                    status:"success"
                })
            } else {
                res.status(404).json({
                    status:"error",
                    message:"User isn't found"
                });
            }
           
        }
        catch(e) {
             res,status(500).json({
                 status:"error",
                 message:e
             })   
        }

    }

    async afterLogin(req,res) {
        try {
            const user = req.user? req.user.toJSON() : undefined;

            res.json({
                status:"success",
                data: {
                    ...user,
                    token:jwt.sign({data: req.user},process.env.SECRET_KEY || '123', {
                        expiresIn:'10d'
                    })
                }
                
            })
        }
        catch (e) {
            res.status(500).json({
                status: 'error',
                message: e
            })
        }
    }

    async getUserInfo(req,res) {
        try {
            
            const user = req.user? req.user.toJSON() : undefined;

            res.json({
                status:"success",
                data:user
            })
        }
        catch (e) {
            res.status(500).json({
                status: 'error',
                message: e
            })
        }
    }

}


module.exports.UserCtrl = new UserController();