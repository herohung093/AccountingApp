export default interface ProductInputType {
    product: {
        code: string;
        name: string;
        price: number;
        unit: string;
    };
    description: string;
    quantity: number;
    operator: {
        name: string;
        mobilePhone: string;
        address: string;
    };
}