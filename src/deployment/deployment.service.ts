import DeploymentModel, { DeploymentDocumnet } from "./deployment.model";
import mongoos, { ObjectId, DocumentDefinition, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose'
import { getImageById } from "../image/image.service";

export async function createDeployment(input: DocumentDefinition<Omit<DeploymentDocumnet, "createdAt" | "updatedAt">>) {
    try {
        const image = await getImageById(input.imageId);
        if (!image) {
            throw new Error("imageId does not exist");
        }
        const deployment = await DeploymentModel.create(input);
        return deployment.toJSON();
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function getAllDeployments(limit: number = Infinity, skip: number = 0) {
    try {
        return await DeploymentModel.find().sort({ createdDate: 'desc' }).limit(limit).skip(skip);
    }
    catch (error: any) {
        throw new Error(error.message);
    }
}