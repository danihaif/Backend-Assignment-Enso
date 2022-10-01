import {Request, Response, NextFunction} from 'express'
import { createImage } from './image.service';
import { verifyJwt } from '../utils/jwt.utils';
import {get} from 'lodash'


export async function createImageHandler (req: Request, res: Response, next: NextFunction) {
    try {
        const image = await createImage(req.body);
        return res.send(image);
    }
    catch(error: any) {
        return res.status(403).send(error.message);
    }

}