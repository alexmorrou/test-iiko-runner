import React from "react";

const Status = ({statusNumder}) => {
    const statusMap = {
        0: 'Еще не готовится',
        1: 'Готовится - 1',
        2: 'Готовится - 2',
        3: 'Готовится - 3',
        4: 'Готовится - 4',
        5: 'Готовится - 5',
        6: 'Приготовлено',
        7: 'Подано',
    }
return (
    <>
        {statusMap[statusNumder]}
    </>
)

}
export default Status