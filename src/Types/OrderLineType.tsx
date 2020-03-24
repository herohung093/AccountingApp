export default interface OrderLineType {
    product: {
        code: string;
        name: string;
        price: number;
        unit: string;
    };
    quantity: number;
    price: number;
    discount: number;
    totalPrice: number;
    id: number;
}