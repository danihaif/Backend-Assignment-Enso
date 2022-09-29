import {Express, Request, Response} from 'express'
import { createImageHandler } from './controllers/image.controller';


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

     app.post("/api/image", createImageHandler);
}

export default routes;