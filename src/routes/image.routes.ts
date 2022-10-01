import { Express, Request, Response } from 'express'
import { createImageHandler, getAllImagesHandler, getImageHandler, getImagesCombinationsHandler, updateImageHandler } from '../image/image.controller';
import { createImageSchema } from '../image/image.schema';
import { authenticate } from '../middleware/authenticate';
import validateResource from '../middleware/validateResource';



export function imageRoutes(app: Express) {

    app.post("/api/image", [authenticate(), validateResource(createImageSchema)], createImageHandler);

    app.put("/api/image", [authenticate(), validateResource(createImageSchema)], updateImageHandler);

    app.get("/api/image/:_id", authenticate(), getImageHandler);

    app.get("/api/images/", authenticate(), getAllImagesHandler);

    app.get("/api/images/combination/", authenticate(), getImagesCombinationsHandler);

}