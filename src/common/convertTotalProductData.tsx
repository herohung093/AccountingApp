import TotalProductType from "../Types/TotalProductType"
import CustomerSoldType from "../Types/CustomerSoldType";
import OrderLineType from "../Types/OrderLineType";
import OrderDetailType from "../Types/OrderDetailType";
import InventoryType from "../Types/InventoryType";
import BestsellerType from "../Types/BestSellerType";

const convertTotalProductData = (customerSold?: CustomerSoldType[], orderLines?: OrderLineType[], orderDetails?: OrderDetailType[], inventory?: InventoryType[], bestSellers?: BestsellerType[]): TotalProductType[] => {
    let returnData: TotalProductType[]

    let TRC = 0;
    let TR = 0;
    let PR = 0;
    let NN = 0;
    let NNM = 0;
    let NTC = 0;
    let NTCM = 0;
    let KHAY = 0;
    let TENAZ = 0;
    let ACETAL = 0;

    if (orderLines) {
        orderLines.forEach((item: any) => {
            if (item.product.code.substring(0, item.product.code.indexOf("-")) === "TRC")
                TRC += item.quantity;
            if (item.product.code.substring(0, item.product.code.indexOf("-")) === "TR")
                TR += item.quantity;
            if (item.product.code.substring(0, item.product.code.indexOf("-")) === "PR")
                PR += item.quantity;
            if (item.product.code.substring(0, item.product.code.indexOf("-")) === "NN")
                NNM += item.quantity;
            if (item.product.code.substring(0, item.product.code.indexOf("-")) === "NTC")
                NTCM += item.quantity;
            if (item.product.code === "NN")
                NN += item.quantity
            if (item.product.code === "NTC")
                NTC += item.quantity
            if (item.product.code === "Khay")
                KHAY += item.quantity
            if (item.product.code === "TENAZ")
                TENAZ += item.quantity
            if (item.product.code === "ACETAL")
                ACETAL += item.quantity
        }
        )
    }
    if (customerSold) {
        customerSold.forEach((item: any) => {
            if (item.product.substring(0, item.product.indexOf("-")) === "TRC")
                TRC += item.quantity;
            if (item.product.substring(0, item.product.indexOf("-")) === "TR")
                TR += item.quantity;
            if (item.product.substring(0, item.product.indexOf("-")) === "PR")
                PR += item.quantity;
            if (item.product.substring(0, item.product.indexOf("-")) === "NN")
                NNM += item.quantity;
            if (item.product.substring(0, item.product.indexOf("-")) === "NTC")
                NTCM += item.quantity;
            if (item.product === "NN")
                NN += item.quantity
            if (item.product === "NTC")
                NTC += item.quantity
            //     NTCM+= item.quantity
            if (item.product === "Khay")
                KHAY += item.quantity
            if (item.product === "TENAZ")
                TENAZ += item.quantity
            if (item.product === "ACETAL")
                ACETAL += item.quantity
        })
    } if (orderDetails) {
        orderDetails.forEach((item: any) => {
            if (item.product.code.substring(0, item.product.code.indexOf("-")) === "TRC")
                TRC += item.quantity;
            if (item.product.code.substring(0, item.product.code.indexOf("-")) === "TR")
                TR += item.quantity;
            if (item.product.code.substring(0, item.product.code.indexOf("-")) === "PR")
                PR += item.quantity;
            if (item.product.code.substring(0, item.product.code.indexOf("-")) === "NN")
                NNM += item.quantity;
            if (item.product.code.substring(0, item.product.code.indexOf("-")) === "NTC")
                NTCM += item.quantity;
            if (item.product.code === "NN")
                NN += item.quantity
            if (item.product.code === "NTC")
                NTC += item.quantity
            if (item.product.code === "Khay")
                KHAY += item.quantity
            if (item.product.code === "TENAZ")
                TENAZ += item.quantity
            if (item.product.code === "ACETAL")
                ACETAL += item.quantity
        }
        )
    }
    if (inventory) {
        inventory.forEach((item: any) => {
            if (item.code.substring(0, item.code.indexOf("-")) === "TRC")
                TRC += item.stock;
            if (item.code.substring(0, item.code.indexOf("-")) === "TR")
                TR += item.stock;
            if (item.code.substring(0, item.code.indexOf("-")) === "PR")
                PR += item.stock;
            if (item.code.substring(0, item.code.indexOf("-")) === "NN")
                NNM += item.stock;
            if (item.code.substring(0, item.code.indexOf("-")) === "NTC")
                NTCM += item.stock;
            if (item.code === "NN")
                NN += item.stock
            if (item.code === "NTC")
                NTC += item.stock
            if (item.code === "Khay")
                KHAY += item.stock
            if (item.code === "TENAZ")
                TENAZ += item.stock
            if (item.code === "ACETAL")
                ACETAL += item.stock
        }
        )
    }
    if (bestSellers) {
        bestSellers.forEach((item: any) => {
            if (item.productCode.substring(0, item.productCode.indexOf("-")) === "TRC")
                TRC += item.totalSold;
            if (item.productCode.substring(0, item.productCode.indexOf("-")) === "TR")
                TR += item.totalSold;
            if (item.productCode.substring(0, item.productCode.indexOf("-")) === "PR")
                PR += item.totalSold;
            if (item.productCode.substring(0, item.productCode.indexOf("-")) === "NN")
                NNM += item.totalSold;
            if (item.productCode.substring(0, item.productCode.indexOf("-")) === "NTC")
                NTCM += item.totalSold;
            if (item.productCode === "NN")
                NN += item.totalSold
            if (item.productCode === "NTC")
                NTC += item.totalSold
            //     NTCM+= item.totalSold
            if (item.productCode === "Khay")
                KHAY += item.totalSold
            if (item.productCode === "TENAZ")
                TENAZ += item.totalSold
            if (item.productCode === "ACETAL")
                ACETAL += item.totalSold
        })
    }


    returnData = [{
        name: "TRIUMPH C ",
        amount: TRC
    },
    {
        name: "TRIUMPH",
        amount: TR
    },
    {
        name: "PRIMODENT",
        amount: PR
    },
    {
        name: "NHỰA NẤU ",
        amount: NNM
    },
    {
        name: "NHỰA TC",
        amount: NTCM
    },
    {
        name: "NƯỚC NẤU",
        amount: NN
    },
    {
        name: "NƯỚC TC",
        amount: NTC
    },
    {
        name: "KHAY",
        amount: KHAY
    },
    {
        name: "TENAZ",
        amount: TENAZ
    },
    {
        name: "ACETAL",
        amount: ACETAL
    }, {
        name: "TOTAL",
        amount: TRC + TR + PR + NNM + NTCM + NN + NTC + KHAY + TENAZ + ACETAL
    }]

    return returnData;

}
export default convertTotalProductData;