import {Request, Response, NextFunction} from 'express'
import logger from '../utils/logger'
import { createImage } from '../services/image.service';

export async function createImageHandler (req: Request, res: Response) {
    try {
        const image = await createImage(req.body);
        return res.send(image);
    }
    catch(error: any) {
        return res.status(403).send(error.message);
    }

}