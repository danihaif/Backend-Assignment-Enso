import ImageModel, { ImageDocumnet} from "./image.model";
import mongoos, {ObjectId} from 'mongoose'

export async function createImage(input:ImageDocumnet) {
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