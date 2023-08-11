import { randomUUID } from "crypto";
import { CreateProductDTO } from "./dtos/create-product.dto";

export class Product extends CreateProductDTO {
  public createdAt: string = new Date().toISOString();
  public updatedAt: string = new Date().toISOString();
  public id: string = randomUUID();

  constructor(dto: CreateProductDTO) {
    super(dto.name, dto.price, dto.category, dto.barCode);
  }
}
