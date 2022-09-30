import logger from "../utils/logger";
import ImageModel, { ImageDocumnet} from "../models/image.model";

export async function createImage(input:ImageDocumnet) {
    try {
        const image = await ImageModel.create(input);
        return image.toJSON();
    } catch(error: any) {
        throw new Error(error);
    }

}