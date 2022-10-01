import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import {get} from 'lodash'
import { isAuthenticated } from "../utils/jwt.utils";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      return res.status(400).send(e.errors);
    }
  };

  export const autheticate =
  () =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
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

export default validate;