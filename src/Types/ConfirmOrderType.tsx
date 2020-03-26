import OrderLineType from "./OrderLineType"
export default interface ConfirmOrder {
    id: number;
    customer: {
        id: number;
        phone: string;
        address: string;
        name: string;
        contactPerson: string;
        note: string;
        createAt: string | null;
    };
    createAt: string;
    updateAt: string;
    paid: number;
    note: string;
    instalment: boolean;
    staff: {
        name: string;
        mobilePhone: string | null;
        address: string | null;
    };
    orderLines: OrderLineType[]
}
