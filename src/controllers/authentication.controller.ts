import {Request, Response, NextFunction} from 'express'
import config from 'config'
import { signJwt } from '../utils/jwt.utils';


export async function getAccessTokenHandler (req: Request, res: Response) {
    try {

        // if username and password are correct
        const userName = "danihaif";
        const password = "31121988";
        const accessToken = signJwt( {userName, password}, {expiresIn: config.get('accessTokenTtl')} /*15 minutes*/);

        return res.send(accessToken)
    }
    catch(error: any) {
        return res.status(403).send(error.message);
    }

}