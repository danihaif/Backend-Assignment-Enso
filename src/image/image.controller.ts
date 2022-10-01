import { Request, Response, NextFunction } from 'express'
import { createImage, findAndUpdateImage, getAllImages, getImageById, getImageByName, getImagesCombination } from './image.service';
import { verifyJwt } from '../utils/jwt.utils';
import { get } from 'lodash'
import logger from '../utils/logger'
import { send } from 'process';


export async function createImageHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const image = await createImage(req.body);
        return res.send(image);
    }
    catch (error: any) {
        return res.status(403).send(error.message);
    }
}

export async function getImageHandler(req: Request, res: Response) {
    const imageId = req.query['_id'] as string;
    try {
        const image = await getImageById(imageId);
        if (!image) {
            throw new Error("Image ID not found")
        }
        return res.send(image);
    }
    catch (error: any) {
        return res.status(404).send(error.message);
    }
}

export async function getAllImagesHandler(req: Request, res: Response) {
    let parsedLimit = req.query.limit ? +req.query.limit : undefined;
    let parsedSkip = req.query.skip ? +req.query.skip : undefined;
    let sortBy = req.query.filterBy ? `${req.query.filterBy}` : "";

    try {
        const images = await getAllImages(parsedLimit, parsedSkip, sortBy);
        return res.send(images);
    }
    catch (error: any) {
        return res.status(404).send(error.message);
    }
}

export async function getImagesCombinationsHandler(req: Request, res: Response) {
    try {
        const length = req.query.length ? +req.query.length : null;
        if (!length) {
            throw new Error("Must supply length for combination");
        }
        const images = await getImagesCombination(length);
        return res.send(images);
    }
    catch (error: any) {
        return res.status(404).send(error.message);
    }
}

export async function updateImageHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const imageName = req.body['name'];
        const image = await getImageByName(imageName);
        if (!image) {
            const image = await createImage(req.body);
            return res.send(image);
        }
        else {
            image.metadata = { ...image.metadata, ...req.body.metadata };
            const updatedImage = await findAndUpdateImage({ _id: image._id }, image, { new: true });
            return res.send(image);
        }
        return res.send(image);
    }
    catch (error: any) {
        return res.status(403).send(error.message);
    }
}