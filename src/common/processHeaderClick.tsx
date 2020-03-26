

const processHeaderClick = (
    value: string,
    revertOrder: boolean,
    sourceData: any[],
    setRevertOrder: (value: boolean) => void,
    setNewData: (newData: any[]) => void) => {


    let sortedData: any[]
    if (revertOrder) {
        sortedData = [...sourceData].sort((a, b) => (Reflect.get(a, value) > Reflect.get(b, value)) ? 1 : -1)
        setRevertOrder(false)
    } else {
        sortedData = [...sourceData].sort((a, b) => (Reflect.get(a, value) < Reflect.get(b, value)) ? 1 : -1)
        setRevertOrder(true)
    }
    setNewData(sortedData)
}
export default processHeaderClick