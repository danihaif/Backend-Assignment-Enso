import { Express, Request, Response } from 'express'
import { createDeploymentHandler, getAllDeploymentsHandler, getDeploymentsCountHandler } from '../deployment/deployment.controller';
import { createDeploymentSchema } from '../deployment/deployment.schema';
import { authenticate } from '../middleware/authenticate';
import validateResource from '../middleware/validateResource';


export function deploymentRoutes(app: Express) {

    app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

    app.post("/api/deployment/", [authenticate(), validateResource(createDeploymentSchema)], createDeploymentHandler)

    app.get("/api/deployment/", authenticate(), getAllDeploymentsHandler)

    app.get("/api/deployment-count/", authenticate(), getDeploymentsCountHandler)
}