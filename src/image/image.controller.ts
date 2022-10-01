import {Request, Response, NextFunction} from 'express'
import { createImage, findAndUpdateImage, getImageById, getImageByName } from './image.service';
import { verifyJwt } from '../utils/jwt.utils';
import {get} from 'lodash'
import logger from '../utils/logger'
import { send } from 'process';


export async function createImageHandler (req: Request, res: Response, next: NextFunction) {
    try {
        const image = await createImage(req.body);
        return res.send(image);
    }
    catch(error: any) {
        return res.status(403).send(error.message);
    }
}

export async function getImageHandler(req: Request, res: Response) {
    const imageId = req.params._id;
    try {
        const image = await getImageById(req.params._id);
        if (!image) {
            throw new Error("Image ID not found")
        }
        return res.send(image);
    }
    catch(error: any) {
        return res.status(404).send(error.message);
    }
}

export async function updateImageHandler (req: Request, res: Response, next: NextFunction) {
    try {
        const imageName = req.body['name'];
        const image = await getImageByName(imageName);
        if (!image) {
            const image = await createImage(req.body);
            return res.send(image);
        }
        else {
            image.metadata = {...image.metadata, ...req.body.metadata};
            const updatedImage = await findAndUpdateImage({_id: image._id}, image, {new: true});
            return res.send(image);
        }
        return res.send(image);
    }
    catch(error: any) {
        return res.status(403).send(error.message);
    }
}