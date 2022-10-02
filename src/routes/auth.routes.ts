import { Express } from 'express'
import { getAccessTokenHandler } from '../auth/authentication.controller';


export function authRoutes(app: Express) {

    app.post("/api/get-access-token", getAccessTokenHandler);

}