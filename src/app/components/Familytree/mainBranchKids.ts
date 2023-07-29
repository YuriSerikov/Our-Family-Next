import { IPersonCard } from '../../models/psnCardType'

function mainBranchKids(objPerson:IPersonCard | null, objSpouse:IPersonCard | null, arrAllPsns:IPersonCard[]) {
  let arrPersonKids:IPersonCard[] = []
  let dad: string | null = ''
  let mom: string | null = ''

  if (!objPerson) {
    return []
  }

  const isPersonMan = objPerson.gender === 'Man' ? true : false

  if (objSpouse) {
    dad = isPersonMan ? objPerson.longname : objSpouse.longname
    mom = isPersonMan ? objSpouse.longname : objPerson.longname
  } else {
    dad = isPersonMan ? objPerson.longname : null
    mom = isPersonMan ? null : objPerson.longname
  }

  // выбрать детей персоны
  if (dad && mom) {
    arrPersonKids = arrAllPsns.filter((elem) => elem.dad === dad && elem.mother === mom && elem.level === 0)
  } else if (dad && !mom) {
    arrPersonKids = arrAllPsns.filter((elem) => elem.dad === dad && !elem.mother && elem.level === 0)
  } else if (!dad && mom) {
    arrAllPsns = arrAllPsns.filter((elem) => !elem.dad && elem.mother === mom && elem.level === 0)
  } else {
    return []
  }
  arrPersonKids.sort((a, b) => a.pozX - b.pozX)
  return arrPersonKids
}
export default mainBranchKids
