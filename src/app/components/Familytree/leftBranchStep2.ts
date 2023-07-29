import findExSpouses from "./findExSpouses";
import findSpouse from "./findSpouse";
import insertExSpouseLeftUp from "./insertExSpouseLeftUp";
import insertSpouseLeftUp from "./insertSpouseLeftUp";
import leftBranchStep3 from "./leftBranchStep3";
import mainBranchKids from "./mainBranchKids";
import personKidPlaceLeft from "./personKidPlaceLeft";
import { IPersonCard } from "../../models/psnCardType";
import { ISpouseType } from "../../models/spousesType";
import { IExspouseType } from "../../models/exsposesType";

const leftBranchStep2 = (
  objPerson:IPersonCard,
  objSpouse:IPersonCard | null,
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

  let N = arrPersonKids.length;
  if (N === 0) {
    return arrAllPersons;
  }

  arrPersonKids.sort((a:IPersonCard, b:IPersonCard) => a.pozX - b.pozX);
  for (let i = N - 1; i >= 0; i--) {
    arrAllPersons = personKidPlaceLeft(
      objPerson,
      objSpouse,
      arrPersonKids[i],
      arrAllPersons
    );
    // если персона - мужчина, начиная с экс жен, если - женщина  - с мужа
    if (arrPersonKids[i].gender === "Man") {
      // найти бывших жен 6-ого уровня
      let personExWifes6 = findExSpouses(
        arrPersonKids[i],
        arrAllPersons,
        exspouses
      );

      // вставить каждую и начать ветку
      if (personExWifes6.length > 0) {
        for (let k = 0; k < personExWifes6.length; k++) {
          arrAllPersons = insertExSpouseLeftUp(
            arrPersonKids[i],
            personExWifes6[k],
            arrAllPersons
          );
          // начать ветку
          arrAllPersons = leftBranchStep3(
            arrPersonKids[i],
            personExWifes6[k],
            arrAllPersons,
            spouses,
            exspouses
          );
        }
      }
      // вставляю жену
      let objPersonWife = findSpouse(arrPersonKids[i], arrAllPersons, spouses);

      if (objPersonWife) {
        arrAllPersons = insertSpouseLeftUp(
          arrPersonKids[i],
          objPersonWife,
          arrAllPersons
        );
        // начать ветку
        arrAllPersons = leftBranchStep3(
          arrPersonKids[i],
          objPersonWife,
          arrAllPersons,
          spouses,
          exspouses
        );
      }
      // случай, когда о втором родителе нет инфо
      if (!personExWifes6 && !objPersonWife) {
      }
    } else {
      // найти мужа уровня 6
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
        // начать ветку
        arrAllPersons = leftBranchStep3(
          arrPersonKids[i],
          objPersonHusband,
          arrAllPersons,
          spouses,
          exspouses
        );
      }
      // найти в массиве бывших мужей 6-ого уровня
      let personExHusbands6 = findExSpouses(
        arrPersonKids[i],
        arrAllPersons,
        exspouses
      );

      // вставить каждого и
      if (personExHusbands6.length > 0) {
        for (let k = 0; k < personExHusbands6.length; k++) {
          arrAllPersons = insertExSpouseLeftUp(
            arrPersonKids[i],
            personExHusbands6[k],
            arrAllPersons
          );
          // начать ветку
          arrAllPersons = leftBranchStep3(
            arrPersonKids[i],
            personExHusbands6[k],
            arrAllPersons,
            spouses,
            exspouses
          );
        }
      }
      // случай, когда о втором родителе нет инфо
      if (!personExHusbands6 && !objPersonHusband) {
      }
    }
  }

  return arrAllPersons;
};
export default leftBranchStep2;
