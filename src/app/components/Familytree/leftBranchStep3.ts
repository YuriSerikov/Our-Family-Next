import findSpouse from "./findSpouse";
import insertSpouseLeftUp from "./insertSpouseLeftUp";
import mainBranchKids from "./mainBranchKids";
import personKidPlaceLeft from "./personKidPlaceLeft";
import { IPersonCard } from "../../models/psnCardType";
import { ISpouseType } from "../../models/spousesType";
import { IExspouseType } from "../../models/exsposesType";

const leftBranchStep3 = (
  objPerson: IPersonCard,
  objSpouse: IPersonCard | null,
  arrAllPersons:IPersonCard[],
  spouses:ISpouseType[],
  exspouses:IExspouseType[]
) => {
  if (!objPerson) {
    return arrAllPersons;
  }
  // пара родителей (второй родитель м.б. не известен)
  // надо построить каскадно один уровнь вниз
  let arrPersonKids = [];
  arrPersonKids = mainBranchKids(objPerson, objSpouse, arrAllPersons);

  arrPersonKids.sort((a:IPersonCard, b:IPersonCard) => a.pozX - b.pozX);
  for (let i = 0; i < arrPersonKids.length; i++) {
    arrAllPersons = personKidPlaceLeft(
      objPerson,
      objSpouse,
      arrPersonKids[i],
      arrAllPersons
    );
    if (arrPersonKids[i].gender === "Man") {
      // вставляю жену
      let objPersonWife = findSpouse(arrPersonKids[i], arrAllPersons, spouses);
      if (objPersonWife) {
        arrAllPersons = insertSpouseLeftUp(
          arrPersonKids[i],
          objPersonWife,
          arrAllPersons
        );
      }
    } else {
      // найти мужа уровня "дети"
      let objPersonHusband = findSpouse(
        arrPersonKids[i],
        arrAllPersons,
        spouses
      );
      // вставить мужа
      if (objPersonHusband) {
        arrAllPersons = insertSpouseLeftUp(
          arrPersonKids[i],
          objPersonHusband,
          arrAllPersons
        );
      }
    }
  }

  return arrAllPersons;
};
export default leftBranchStep3;
