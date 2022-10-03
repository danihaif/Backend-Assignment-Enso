import DeploymentModel, { DeploymentDocumnet } from "./deployment.model";
import mongoos, { ObjectId, DocumentDefinition, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose'
import { getImageById } from "../image/image.service";
import * as fs from "fs";
import config from 'config'
import logger from "../utils/logger";

const path = config.get<string>("pathToCount");

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
    try {
        let data = fs.readFileSync(path, "utf8");
        let numOfDeployments = +data;
        numOfDeployments++;
        fs.writeFileSync(path, String(numOfDeployments), 'utf8')
    } catch (error: any) {
        if (error['errno'] === -2) {
            logger.error(error.message);
            await generateCount();
        }
        else {
            logger.error(error.message)
        }
    }
}

async function generateCount() {
    logger.info("Fetching number of deployments and creating count.txt");
    const deployments = await getAllDeployments();
    const numOfDeployments = deployments.length;
    fs.writeFileSync(path, String(numOfDeployments), 'utf8');
}

export async function getDeploymentsCount() {
    try {
        return fs.readFileSync(path, "utf8")
    } catch (error: any) {
        if (error['errno'] === -2) {
            logger.error(error.message);
            await generateCount();
            return fs.readFileSync(path, "utf8")
        }
        else {
            logger.error(error.message)
        }
    }
}

export function resetDeploymentsCount() {
    try {
        fs.writeFileSync(path, String(0), 'utf8')
    } catch (error: any) {
        console.log(error.message)
    }
}
