import { constRelTree } from "../Relatives/constRelTree";
import areMarried from "./areMarried";
import { ISpouseType } from "../../models/spousesType";
import { IPersonCard } from "../../models/psnCardType";

const addSpaceCaseManWomanNotMarried = (arrPersons: IPersonCard[], spouses: ISpouseType[]) => {

    const mgn = constRelTree.marginCard
    let theyMarried = true;

    if (arrPersons.length > 1) {
        arrPersons.sort((a, b) => a.pozX - b.pozX)
        
        for (let i = 1; i < arrPersons.length ; i++) {
            //console.log('запущена фукция addSpaceCaseManWomanNotMarried')
            let genderPrevPerson = arrPersons[i - 1].gender;
            let genderCurPerson = arrPersons[i].gender;
            let prevPersonLongname = arrPersons[i - 1].longname;
            let curPersonLongname = arrPersons[i].longname;
            //console.log('genderCurPerson = ', genderCurPerson)

            if ((genderPrevPerson === 'Man') && (genderCurPerson === 'Woman')) {
                
                theyMarried = areMarried(spouses, prevPersonLongname, curPersonLongname)
                //console.log('theyMarried = ', theyMarried)
                if (!theyMarried) {
                    //console.log('prevPersonLongname = ', prevPersonLongname)
                    //console.log('curPersonLongname = ', curPersonLongname)
                    //console.log('добавлен зазор')
                    for (let k = i; k < arrPersons.length; k++) {
                        arrPersons[k].pozX = arrPersons[k].pozX + mgn
                    }
                }
            }
        }
    }
    return arrPersons
}
export default addSpaceCaseManWomanNotMarried