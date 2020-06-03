import { Router } from "express";
import ItemController from "../controllers/ItemController";

const itemsRouter = Router();
const itemController = new ItemController();

itemsRouter.get("/", itemController.index);

export default itemsRouter;
