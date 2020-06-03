import { Router, Request, Response } from "express";

import ItemRouter from "./items.routes";
import PointRouter from "./point.routes";

const routes = Router();

routes.use("/items", ItemRouter);
routes.use("/points", PointRouter);

export default routes;
