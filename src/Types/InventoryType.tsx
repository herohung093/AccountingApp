export default interface InventoryType {
    code: string;
    stock: number;
    product: {
        code: string;
        name: string;
        price: number;
        unit: string
    }
}