import express from "express";


export const authorize = (...roles:string[]) =>{
    return(req:express.Request, res:express.Response, next:express.NextFunction) => {
        if(!(req as any).user){
            return res.status(401).json({error:"You are not authenticated"});
        }

        if(!roles.includes((req as any).user.role)){
            return res.status(403).json({error:"You are not authorized"});
        }

        next()
    }

}