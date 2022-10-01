import {Request, Response, NextFunction} from 'express'
import config from 'config'
import { signJwt } from '../utils/jwt.utils';


export async function getAccessTokenHandler (req: Request, res: Response) {
    try {

        // if username and password are correct
        const userName = req.body['user'];
        const password = req.body['password'];
       
        const accessToken = signJwt( {userName, password}, {expiresIn: config.get('accessTokenTtl')} /*1y*/);

        return res.send(accessToken)
    }
    catch(error: any) {
        return res.status(403).send(error.message);
    }

}