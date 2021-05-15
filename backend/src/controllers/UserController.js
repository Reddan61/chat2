const {sendEmail} = require("../utils/sendEmail");
const mongoose = require("mongoose");
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const {UserModel} = require("../models/UserModel");
const {generateMD5} = require("../utils/generateHash");
const {deleteFile} = require("../utils/deleteFile")

class UserController {
    async index(req, res) {
        try {
            const {pageNumber = 1,userNameSearch = ""} = req.query;
            const pageSize = 12;
            const totalUsersCount = await UserModel.countDocuments({username: {$regex: userNameSearch,$options: "i"}}).exec();
            const totalPageCount = Math.ceil(totalUsersCount/pageSize);
            let skip = (pageNumber - 1) * pageSize;
            
            if(pageNumber > totalPageCount) {
                skip = (totalPageCount - 1) * pageSize;
            }
            if(skip < 0) {
                skip = totalPageCount * pageSize
            }
            const limit = parseInt(pageSize);
            const users = await UserModel.find({username: {$regex: userNameSearch,$options: "i"}}).select(["-email","-confirmed"]).limit(limit).skip(skip).exec();
            res.json({
                status: "success",
                data: {
                    users,
                    totalPageCount
                }
            })

        } catch (e) {
            res.status(500).json({
                status: 'error',
                message: JSON.stringify(e)
            })
        }
    }

    async show(req,res){
        try {
            const userId = req.params.id;
            if(!mongoose.Types.ObjectId.isValid(userId)) {
                res.status(400).send();
                return
            }
        
            const user = await UserModel.findById(userId).exec();
    
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
        catch(e) {
            res.status(500).json({
                status: 'error',
                message: JSON.stringify(e)
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

    async updateAvatar(req,res) {
        try {
            const userId = req.user._id;
            if(!mongoose.Types.ObjectId.isValid(userId)) {
                res.status(400).send();
                return
            }
            let update = {}
            if(req.file) {
                update.avatar = req.file.path
                const user = await UserModel.findById(userId);
                await deleteFile(user.avatar);
            }
           
            const user = await UserModel.findOneAndUpdate({
                _id:userId
            },
            {
                $set:update
            }, {new:true, useFindAndModify:false});

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
        catch(e) {
            res.status(500).json({
                status: 'error',
                message: JSON.stringify(e)
            })
        }

    }


    async fargotPassword(req,res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({status: "error", errors: errors.array()});
                return;
            }

            const {email} = req.body;

            const user = await UserModel.findOne({email}).exec();

            if(!user) {
                res.status(404).json({
                    status:"error",
                    message:"User isn't found"
                })
                return
            }
            if(!user.confirmed) {
                res.status(406).json({
                    status:"error",
                    message:"Email isn't confirmed"
                })
                return
            }
            const token = jwt.sign({_id:user._id},process.env.RESET_PASSWORD_KEY,{expiresIn:'20m'});
            
            await user.updateOne({resetPassword:token}).exec();
               
            sendEmail({
                emailFrom: 'admin@chat.ru',
                emailTo: user.email,
                subject: "Reset password Chat",
                html: `Please reset your password by clicking this
            <a href="${process.env.CLIENT_URL}/resetpassword/${token}">link</a>`
            },(err) => {
                if(err) {
                    res.status(500).json({
                        status:"error",
                        message: JSON.stringify(err)
                    })
                } else {
                    res.status(201).json({
                        status: "success",
                        data: {
                            message:'Email has been sent'
                        }
                    });
                }
            })
        }
        catch(e) {
            res.status(500).json({
                status: 'error',
                message: e
            })
        }
        
    }

    async resetPassword(req,res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({status: "error", errors: errors.array()});
                return;
            }
    
            const {resetToken, password} = req.body;
    
            if(!resetToken){
                return res.status(400).json({status:"error",message:"Token not found"})
            }
    
            jwt.verify(resetToken,process.env.RESET_PASSWORD_KEY);
    
            const user = await UserModel.findOne({resetPassword:resetToken}).exec();
    
            if(!user) {
                return res.status(404).json({
                    status:"error",
                    message:"User isn't found"
                })
            }
            await user.updateOne({password:generateMD5(password + process.env.SECRET_KEY)});
    
            res.status(201).json({
                status:"success",
                data: {
                    message:'Password has been changed'
                }
            })
        }
        catch(e) {
            res.status(500).json({
                status: 'error',
                message: e
            })
        }
    }
}


module.exports.UserCtrl = new UserController();