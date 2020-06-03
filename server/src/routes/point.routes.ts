import { Router } from "express";

import PointsController from "../controllers/PointController";

const pointRouter = Router();
const pointsController = new PointsController();

pointRouter.get("/", pointsController.index);
pointRouter.get("/:id", pointsController.show);
pointRouter.post("/", pointsController.create);

export default pointRouter;
