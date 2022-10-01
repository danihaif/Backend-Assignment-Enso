import { Request, Response, NextFunction } from 'express'
import { createDeployment, getAllDeployments, getDeploymentsCount } from './deployment.service';

export async function createDeploymentHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const deployment = await createDeployment(req.body);
        return res.send(deployment);
    }
    catch (error: any) {
        return res.status(403).send(error.message);
    }
}

export async function getAllDeploymentsHandler(req: Request, res: Response, next: NextFunction) {
    try {
        let limit = req.query.limit ? +req.query.limit : undefined;
        let skip = req.query.skip ? +req.query.skip : undefined;
        const deployments = await getAllDeployments(limit, skip);
        return res.send(deployments);
    }
    catch (error: any) {
        return res.status(403).send(error.message);
    }
}

export async function getDeploymentsCountHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const deploymentCount = getDeploymentsCount();
        return res.send(deploymentCount);
    }
    catch (error: any) {
        return res.status(403).send(error.message);
    }
}