import DeploymentModel, { DeploymentDocumnet } from "./deployment.model";
import mongoos, { ObjectId, DocumentDefinition, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose'
import { getImageById } from "../image/image.service";
import * as fs from "fs";
import config from 'config'


export async function createDeployment(input: DocumentDefinition<Omit<DeploymentDocumnet, "createdAt" | "updatedAt">>) {
    try {
        const image = await getImageById(input.imageId);
        if (!image) {
            throw new Error("imageId does not exist");
        }
        const deployment = await DeploymentModel.create(input);
        updateCount();
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

async function updateCount() {
    const path = config.get<string>("pathToCount");
    try {
        fs.readFile(path, "utf8", (err, data) => {
            let numOfDeployments = +data;
            numOfDeployments++;
            fs.writeFile(path, String(numOfDeployments), 'utf8', (err) => {
                console.log(err)
            })
        })
    } catch (error: any) {
        console.log(error.message)
    }
}

export function getDeploymentsCount() {
    const path = config.get<string>("pathToCount");
    return fs.readFileSync(path, "utf8")
}
