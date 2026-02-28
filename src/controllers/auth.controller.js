const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

// for  POST /api/auth/register 
async function RegisterController(req, res){
    const {email, name, password} = req.body;

    const isUserExists  =  await userModel.findOne({
        email
    })
    if(isUserExists){
        return res.status(422).json({
            message : "User already exists",
            status : "failed"
        })
    }

    const user = await userModel.create({
        email,
        name,
        password
    })

    const token = jwt.sign({id : user._id}, 
        process.env.JWT_SECRET,
        {expiresIn : "3d"}
    )

    res.cookie("token", token);

    res.status(201).json({
        user : {
            _id : user._id,
            email : user.email,
            password : user.password,
            name : user.name
        },
        token
    });
}

// for POST /api/auth/login
async function LoginController(req, res){

    const { email, password } = req.body;

    const user = await userModel.findOne({email}).select("+password");

    if(!user){
        return res.status(404).json({
            message : "User not found",
            status : "failed"
        })
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if(!isPasswordValid){
        return res.status(404).json({
            message: "Invalid Password",
            status : "failed"
        })
    }

    const token = jwt.sign({id : user._id},
        process.env.JWT_SECRET,
        {expiresIn : "3d"}
    )

    res.cookie("token", token);

    res.status(200).json({
        user : {
            _id : user._id,
            email : user.email,
            name: user.name,
            password:  password,
        }, 
        token
    })

}

module.exports = {
    RegisterController,
    LoginController
}