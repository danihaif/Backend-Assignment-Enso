import {Express, Request, Response} from 'express'
import { getAccessTokenHandler } from './controllers/authentication.controller';
import { createImageHandler } from './controllers/image.controller';
import validateResource, {autheticate} from './middleware/validateResource';
import { createImageSchema } from './schemas/image.schema';


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

     app.post("/api/image", [validateResource(createImageSchema), autheticate()], createImageHandler);
}

export default routes;