import { Request, Response, NextFunction } from "express";
import { get } from 'lodash'
import { isAuthenticated } from "../utils/jwt.utils";

export const authenticate = () =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.headers['authorization']) {
        throw new Error("Missing jwt access token");
      }
      const accessToken = get(req, "headers.authorization").replace(/^Bearer\s/, "");
      const isAuth = isAuthenticated(accessToken);
      if (isAuth) next();
      else {
        throw new Error("Unauthorized");
      }
    } catch (e: any) {
      return res.status(401).send(e.message);
    }
  };