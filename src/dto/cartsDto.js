export class CartsDto {
    constructor( datos ) {
        this.id = datos.id
        this.userName = datos.userName
        this.products = datos.products.reduce((acc, product) => {
            return [... acc, {
                id: product.id,
                title: product.title,
                description: product.description,
                photoUrl: product.photoUrl,
                price: product.price,
                stock: product.stock
            }]
        },[])
    }
}