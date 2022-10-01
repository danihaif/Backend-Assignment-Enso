import { Express, Request, Response } from 'express'
import { getAccessTokenHandler } from './auth/authentication.controller';
import { createImageHandler, getAllImagesHandler, getImageHandler, getImagesCombinationsHandler, updateImageHandler } from './image/image.controller';
import { authenticate } from './middleware/authenticate';
import { createImageSchema } from './image/image.schema';
import { createDeploymentHandler, getAllDeploymentsHandler, getDeploymentsCountHandler } from './deployment/deployment.controller';
import { createDeploymentSchema } from './deployment/deployment.schema';
import { appRoutes } from './routes/auth.routes';
import { imageRoutes } from './routes/image.routes';
import { deploymentRoutes } from './routes/deployment.routes';


function routes(app: Express) {
    /**
     * @openapi
     * /healthcheck:
     *  get:
     *     tags:
     *     - Healthcheck
     *     description: Responds if the app is up and running
     *     responses:
     *       200:
     *         description: App is up and running
     */
    app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

    appRoutes(app);

    imageRoutes(app);

    deploymentRoutes(app);
}

export default routes;