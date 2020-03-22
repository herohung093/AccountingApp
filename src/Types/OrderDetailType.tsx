export default interface OrderDetailType {
    product: {
        code: string;
        name: string;
        price: number;
        unit: string
    };
    quantity: number;
    price: number;
    discount: number;
    totalPrice: number;
    id: number;
    order: string
}