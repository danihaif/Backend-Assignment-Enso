import { Express, Request, Response } from 'express'
import { createImageHandler, getAllImagesHandler, getImageHandler, getImagesCombinationsHandler, updateImageHandler } from '../image/image.controller';
import { createImageSchema } from '../image/image.schema';
import { authenticate } from '../middleware/authenticate';
import validateResource from '../middleware/validateResource';



export function imageRoutes(app: Express) {
    /**
     * @openapi
     * /api/image:
     *  post:
     *     tags:
     *     - Image
     *     summary: Creates an Image
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *              $ref: '#/components/schemas/CreateImageInput'
     *     responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/CreateImageResponse'
     *      409:
     *        description: Conflict
     *      400:
     *        description: Bad request
     */
    app.post("/api/image", [authenticate(), validateResource(createImageSchema)], createImageHandler);

    app.put("/api/image", [authenticate(), validateResource(createImageSchema)], updateImageHandler);

    app.get("/api/image/:_id", authenticate(), getImageHandler);

    app.get("/api/images", authenticate(), getAllImagesHandler);

    app.get("/api/images/combination", authenticate(), getImagesCombinationsHandler);

}