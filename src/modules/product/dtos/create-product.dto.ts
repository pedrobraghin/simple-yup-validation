export class CreateProductDTO {
  constructor(
    public name: string,
    public price: number,
    public category: string,
    public barCode?: string
  ) {}
}
