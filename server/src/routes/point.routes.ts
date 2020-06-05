import { Router } from "express";

import PointsController from "../controllers/PointController";
import multer from "multer";
import multerConfig from "../config/multer";
import { celebrate, Joi } from "celebrate";

const pointRouter = Router();
const pointsController = new PointsController();
const upload = multer(multerConfig);

pointRouter.get("/", pointsController.index);
pointRouter.get("/:id", pointsController.show);
pointRouter.post(
  "/",
  upload.single("image"),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        uf: Joi.string().length(2).required(),
        city: Joi.string().required(),
        items: Joi.string().required(),
      }),
    },
    { abortEarly: false }
  ),
  pointsController.create
);

export default pointRouter;
