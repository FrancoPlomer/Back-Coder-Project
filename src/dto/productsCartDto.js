export class ProductsDto {
    constructor( datos ) {
        this.id = datos.id
        this.title = datos.title
        this.description = datos.description
        this.photoUrl = datos.photoUrl
        this.price = datos.price
        this.stock = datos.stock
    }
}