import { Product } from "./product.entity";
import { validate } from "../../utils/validator";
import { productSchema } from "./product.validator";
import { Request, Response, NextFunction } from "express";
import { CreateProductDTO } from "./dtos/create-product.dto";
import { NotFoundError } from "./../../errors/NotFoundError";
import { BadRequestError } from "./../../errors/BadRequestError";

const products: Product[] = [];

class ProductsController {
  async create(req: Request, res: Response, next: NextFunction) {
    const dto: CreateProductDTO = req.body;

    const validation = await validate<CreateProductDTO>(productSchema, dto);

    if (validation.error) {
      return next(new BadRequestError("Validation error", validation.errors));
    }

    const product = new Product(validation.data);
    products.push(product);

    return res.status(201).json({
      statusCode: 201,
      message: "Product created successfully",
      data: product,
    });
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const product = products.find((p) => p.id === id);

    if (!product) {
      return next(new NotFoundError("Product not found"));
    }

    return res.status(200).json({
      statusCode: 200,
      data: product,
    });
  }

  async index(_req: Request, res: Response, _next: NextFunction) {
    return res.status(200).json({
      statusCode: 200,
      results: products.length,
      data: products,
    });
  }
}

export default new ProductsController();
