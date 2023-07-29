import { IPersonCard } from "../../models/psnCardType";

const minPozX = (arrPersons: IPersonCard[]) => {
    
    if (!arrPersons.length) { return 0}
    
    let min = arrPersons[0].pozX;

    for (let i = 1; i < arrPersons.length; i++) {
        let value = arrPersons[i].pozX

        min = (value < min) ? value : min
    };

    return min
}

export default minPozX