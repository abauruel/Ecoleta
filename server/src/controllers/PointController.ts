import { Response, Request, response } from "express";
import knex from "../database/connection";

class PointController {
  async create(request: Request, response: Response): Promise<Response> {
    console.log(request.file);

    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;
    const trx = await knex.transaction();
    const point = {
      name,
      email,
      image: request.file.filename,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };
    const pointId = await trx("points").insert(point);
    const point_id = pointId[0];
    const point_item = items
      .split(",")
      .map((item: string) => Number(item.trim()))
      .map((item: number) => {
        return {
          point_id,
          item_id: item,
        };
      });

    await trx("point_item").insert(point_item);
    await trx.commit();
    return response.status(201).json({
      id: point_id,
      ...point,
    });
  }

  async index(request: Request, response: Response): Promise<Response> {
    const { city, uf, items } = request.query;
    const itemsParsed = String(items)
      .split(",")
      .map((item) => Number(item.trim()));
    const points = await knex("points")
      .join("point_item", "points.id", "=", "point_item.point_id")
      .whereIn("point_item.item_id", itemsParsed)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    const serializedPoints = points.map((point) => {
      return {
        ...point,
        image_url: `http://localhost:3333/uploads/${point.image}`,
      };
    });
    return response.json(serializedPoints);
  }
  async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const point = await knex("points")
      .select("*")
      .where({
        id: Number(id),
      })
      .first();
    if (!point) {
      return response.status(400).json({ message: "Point not found" });
    }
    const serializedPoint = {
      ...point,
      image_url: `http://localhost:3333/uploads/${point.image}`,
    };
    const items = await knex("items")
      .join("point_item", "items.id", "=", "point_item.item_id")
      .where("point_item.point_id", id)
      .select("items.title");

    return response.json({ point: serializedPoint, items });
  }
}

export default PointController;
