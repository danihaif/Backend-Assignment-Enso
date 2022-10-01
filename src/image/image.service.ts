import ImageModel, { ImageDocumnet} from "./image.model";
import mongoos, {ObjectId, DocumentDefinition, FilterQuery, UpdateQuery, QueryOptions} from 'mongoose'
import { number } from "zod";

export async function createImage(input: DocumentDefinition<Omit<ImageDocumnet, "createdAt" | "updatedAt">>) {
    try {
        const image = await ImageModel.create(input);
        return image.toJSON();
    } catch(error: any) {
        throw new Error(error);
    }
}

export async function getImageById(id: string) {
    try {
        const query = {_id: new mongoos.Types.ObjectId(id)};
        const image = await ImageModel.findOne(query);
        return image;
    }
    catch (error: any) {
        throw new Error(error.message);
    }
}

export async function getImageByName(name: string) {
    try {
        const query = {name: name};
        const image = await ImageModel.findOne(query);
        return image;
    }
    catch (error: any) {
        throw new Error(error.message);
    }
}

export async function getAllImages(limit: number = Infinity, skip: number = 0, sortBy: string = "createdAt") {
    try {     
        if (sortBy != "createdAt" && sortBy != "updatedAt") {
            throw new Error("can filter only by createdAt and updatedAt");
        }

        else {
            const sortByUpdatedAt = sortBy === "updatedAt";
            if (sortByUpdatedAt) {
                return await ImageModel.find().sort({updatedAt: 'desc'}).limit(limit).skip(skip);
            }
            else {
                 return await ImageModel.find().sort({createdAt: 'desc'}).limit(limit).skip(skip);
            }
        }
    }
    catch (error: any) {
        throw new Error(error.message);
    }
}

export async function findAndUpdateImage(
    query: FilterQuery<ImageDocumnet>,
    update: UpdateQuery<ImageDocumnet>,
    options: QueryOptions
  ) {
    return ImageModel.findOneAndUpdate(query, update, options);
  }