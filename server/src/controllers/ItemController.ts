import { Request, Response } from "express";
import knex from "../database/connection";

class Items {
  async create(request: Request, response: Response): Promise<Response> {
    const { title, image } = request.body;
    await knex("items").insert({
      title,
      image,
    });
    return response.status(201).send();
  }
  async index(request: Request, response: Response): Promise<Response> {
    const items = await knex("items").select("*");
    const serializedItems = items.map((item) => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://localhost:3000/uploads/${item.image}`,
      };
    });

    return response.json(serializedItems);
  }
}

export default Items;
