import { Request, Response } from 'express';
import {userModel} from "../Model/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {sendWelcome} from "./emailController.js";


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

        await sendWelcome(email)

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
            {userId:user._id},
            process.env.JWT_SECRET as string,
            {expiresIn:"1d"})

        await sendWelcome(email)
        return  res.status(200).json({message:"Login successful",token:token});

    }catch (e){
        return res.status(500).json({error: `${e}`});
    }
}