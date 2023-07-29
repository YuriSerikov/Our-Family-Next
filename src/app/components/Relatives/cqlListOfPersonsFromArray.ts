import { IPersonCard } from "../../models/psnCardType"

function cqlListOfPersonsFromArray (psnArray: IPersonCard[]) {

    let listOfPersons: string = '['
    if (psnArray.length > 0) {
        for (let i = 0; i < psnArray.length - 1; i++) {
            let longname: string = ''
            longname = psnArray[i].longname
            listOfPersons = listOfPersons + "'" + longname + "', "

        }
        listOfPersons = listOfPersons + "'" + psnArray[psnArray.length-1].longname + "']"
    }
    return listOfPersons
}
export default cqlListOfPersonsFromArray