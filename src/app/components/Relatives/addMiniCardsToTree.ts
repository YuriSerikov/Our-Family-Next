import cqlListOfPersonsFromArray from '../Relatives/cqlListOfPersonsFromArray'
import getIconsWithList from '../../API/Persons_CQL/Relations/getIconsWithList'
import { IPersonCard } from '../../models/psnCardType'

async function addMiniCardsToTree(arrRelPersons:IPersonCard[]): Promise<IPersonCard[]> {
    // добавить изображения карточек
    const addMinicards = (arrPsns: IPersonCard[],
      arrCards: { longname: string, minicard: string }[]): IPersonCard[] => {
        
      let arrPsnsWithCards: IPersonCard[] = []
      
      if (arrPsns.length > 0) {
        arrPsnsWithCards = arrPsnsWithCards.concat(arrPsns)
        for (let i = 0; i < arrPsns.length; i++) {
          let indexPsnInArrCards = arrCards.findIndex((elem) => elem.longname === arrPsns[i].longname)
          if (indexPsnInArrCards > -1) {
            arrPsnsWithCards[i].minicard = arrCards[indexPsnInArrCards].minicard
          }
        }
      }
      return arrPsnsWithCards
    }
    
    let filterPerson: string = cqlListOfPersonsFromArray(arrRelPersons)
    
    let arrMinicardsToAdd: { longname: string, minicard: string }[] = []

    const getMinicards = (
      result: { longname: string, minicard: string }[]): void => {
      arrMinicardsToAdd = arrMinicardsToAdd.concat(result)
    }

    await getIconsWithList(filterPerson, getMinicards)

    arrRelPersons = addMinicards(arrRelPersons, arrMinicardsToAdd)

    return arrRelPersons
}
export default addMiniCardsToTree