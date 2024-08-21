import findExSpouses from "./findExSpouses";
import findSpouse from "./findSpouse";
import insertExSpouseMain from "./insertExSpouseMain";
import insertSpouseMain from "./insertSpouseMain";
import mainBranchKids from "./mainBranchKids";
import personKidPlace from "./personKidPlace";
import { IPersonCard } from '../../models/psnCardType'
import { ISpouseType } from '../../models/spousesType'
import { IExspouseType } from '../../models/exsposesType'
import { constRelTree } from "../Relatives/constRelTree";

const mainBranchStep3 = (
  objPerson:IPersonCard,
  objSpouse:IPersonCard | null,
  arrAllPersons:IPersonCard[],
  spouses:ISpouseType[],
  exspouses:IExspouseType[]
) => {
  if (!objPerson) {
    return arrAllPersons;
  }
  // пара родителей (второй родитель м.б. не известен) из 6-ого уровня
  // надо построить каскадно 7-ой уровнь

  let arrPersonKids = [];

  arrPersonKids = mainBranchKids(objPerson, objSpouse, arrAllPersons);

  let N = arrPersonKids.length;
  if (N === 0) {
    return arrAllPersons;
  }

  for (let numKid = 0; numKid < arrPersonKids.length; numKid++) {
    // проверить, что еще не размещен(-на)
    let kidLongname = arrPersonKids[numKid].longname;
    let indexPsnInArr = arrAllPersons.findIndex(
      (elem) => elem.longname === kidLongname && elem.level > 0
    );
    if (indexPsnInArr > -1) {
      arrAllPersons[indexPsnInArr].lineColor = constRelTree.lineColor;
    } else {
      arrAllPersons = personKidPlace(
        objPerson,
        objSpouse,
        arrPersonKids[numKid],
        N,
        arrAllPersons,
        spouses
      );
      // если персона - мужчина, начиная с экс жен, если - женщина  - с мужа
      if (arrPersonKids[numKid].gender === "Man") {
        // найти бывших жен 7-ого уровня
        let personExWifes7 = findExSpouses(
          arrPersonKids[numKid],
          arrAllPersons,
          exspouses
        );

        // вставить каждую и начать ветку
        if (personExWifes7.length > 0) {
          for (
            let numExSpouse = 0;
            numExSpouse < personExWifes7.length;
            numExSpouse++
          ) {
            arrAllPersons = insertExSpouseMain(
              arrPersonKids[numKid],
              personExWifes7[numExSpouse],
              arrAllPersons
            );
            // начать ветку
          }
        }
        // вставляю жену
        let objPersonWife = findSpouse(
          arrPersonKids[numKid],
          arrAllPersons,
          spouses
        );
        if (objPersonWife) {
          arrAllPersons = insertSpouseMain(
            arrPersonKids[numKid],
            objPersonWife,
            arrAllPersons
          );
        }
        // случай, когда о втором родителе нет инфо
        if (!personExWifes7 && !objPersonWife) {
        }
      } else {
        // найти мужа уровня 7
        let objPersonHusband = findSpouse(
          arrPersonKids[numKid],
          arrAllPersons,
          spouses
        );
        // вставить мужа
        if (objPersonHusband) {
          arrAllPersons = insertSpouseMain(
            arrPersonKids[numKid],
            objPersonHusband,
            arrAllPersons
          );
        }
        // начать ветку
        // найти в массиве бывших мужей 6-ого уровня
        let personExHusbands7 = findExSpouses(
          arrPersonKids[numKid],
          arrAllPersons,
          exspouses
        );

        // вставить каждого и начать ветку
        if (personExHusbands7.length > 0) {
          for (
            let numExSpouse = 0;
            numExSpouse < personExHusbands7.length;
            numExSpouse++
          ) {
            arrAllPersons = insertExSpouseMain(
              arrPersonKids[numKid],
              personExHusbands7[numExSpouse],
              arrAllPersons
            );
          }
        }
        // случай, когда о втором родителе нет инфо
        if (!personExHusbands7 && !objPersonHusband) {
        }
      }
    }
  }
  return arrAllPersons;
};
export default mainBranchStep3;
