import { Express, Request, Response } from 'express'
import { getAccessTokenHandler } from './auth/authentication.controller';
import { createImageHandler, getAllImagesHandler, getImageHandler, getImagesCombinationsHandler, updateImageHandler } from './image/image.controller';
import validateResource from './middleware/validateResource';
import { authenticate } from './middleware/authenticate';
import { createImageSchema } from './image/image.schema';
import { createDeploymentHandler, getAllDeploymentsHandler, getDeploymentsCountHandler } from './deployment/deployment.controller';
import { createDeploymentSchema } from './deployment/deployment.schema';


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

    app.post("/api/get-access-token", getAccessTokenHandler);

    app.post("/api/image", [authenticate(), validateResource(createImageSchema)], createImageHandler);

    app.put("/api/image", [authenticate(), validateResource(createImageSchema)], updateImageHandler);

    app.get("/api/image/:_id", authenticate(), getImageHandler);

    app.get("/api/images/", authenticate(), getAllImagesHandler);

    app.get("/api/images/combination/", authenticate(), getImagesCombinationsHandler);

    app.post("/api/deployment/", [authenticate(), validateResource(createDeploymentSchema)], createDeploymentHandler)

    app.get("/api/deployment/", authenticate(), getAllDeploymentsHandler)

    app.get("/api/deployment-count/", authenticate(), getDeploymentsCountHandler)


}

export default routes;