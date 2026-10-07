import { Request, Response } from 'express';
import {userModel} from "../Model/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {sendWelcome} from "./emailController.js";
import {sendBrevoMail} from "./brevoMailController.js";
import {generateOTP} from "../utils/otp.js";


export const registerUser = async (req: Request, res: Response) => {
    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password || !password.length){
            return res.status(400).json({error: 'names email and password are required'});
        }

        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(400).json({error: 'email already exists'});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        await userModel.create({
            name,email,
            password:hashedPassword
        })


        return res.status(201).json({message: "User created",user:{
            name,email
            }});

    }catch (e){
        return res.status(500).json({error: `server error ${e}`});
    }
}


export const loginUser = async (req: Request, res: Response) => {
    try{
        const {email,password} = req.body
        if(!email || !password){
            return res.status(400).json({error: 'email and password are required'});
        }

        const user = await userModel.findOne({email})
        if(!user){
            return res.status(400).json({error: 'no user with this email or password'});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({error: 'no user with this email or password'});
        }


        const token = jwt.sign(
            {userId:user._id,role:user.role},
            process.env.JWT_SECRET as string,
            {expiresIn:"1d"})

        await sendWelcomeBrevo(email,user.name as string)
        return  res.status(200).json({message:"Login successful",token:token});

    }catch (e){
        return res.status(500).json({error: `${e}`});
    }
}

export const forgotPassword = async (
    req: Request,
    res: Response
) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: "Email is required"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        const code = generateOTP() as string;

        const expires = new Date(
            Date.now() + 10 * 60 * 1000
        );

        user.resetCode = code ;
        user.resetCodeExpires = expires;

        await user.save();

        await sendResetCode(email, code);

        return res.status(200).json({
            message: "Password reset code sent to your email"
        });

    } catch (e) {

        console.log(e)
        return res.status(500).json({
            error: `server error ${e}`
        });

    }
};


export const resetPassword = async (
    req: Request,
    res: Response
) => {

    try {

        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({
                error: "Email, code and new password are required"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        if (!user.resetCode || !user.resetCodeExpires) {
            return res.status(400).json({
                error: "No password reset request found"
            });
        }

        if (user.resetCode !== code) {
            return res.status(400).json({
                error: "Invalid OTP"
            });
        }

        if (user.resetCodeExpires < new Date()) {
            return res.status(400).json({
                error: "OTP has expired"
            });
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        user.password = hashedPassword;

        user.resetCode = undefined;
        user.resetCodeExpires = undefined;

        await user.save();

        return res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (e) {

        return res.status(500).json({
            error: `server error ${e}`
        });
    }
};



export const sendWelcomeBrevo = async (email:string,user:String) =>{
    await sendBrevoMail(email,"Welcome to our API",
        `
            <h2>Welcome</h2>

            <p>You are most welcome to our API ${user}</p>
        `)
}

export const sendResetCode = async (
    email: string,
    code: string
) => {

    await sendBrevoMail(
        email,
        "Password Reset Code",
        `
            <h2>Password Reset</h2>

            <p>You requested to reset your password.</p>

            <p>Your verification code is:</p>

            <h1>${code}</h1>

            <p>This code will expire in 10 minutes.</p>

            <p>If you did not request this, you can ignore this email.</p>
        `
    );
};