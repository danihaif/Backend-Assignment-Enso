import { Express, Request, Response } from 'express'
import { authRoutes } from './routes/auth.routes';
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

    authRoutes(app);

    imageRoutes(app);

    deploymentRoutes(app);
}

export default routes;