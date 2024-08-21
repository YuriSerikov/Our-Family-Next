//import { constRelTree } from "../Relatives/constRelTree";
import findExSpouses from "./findExSpouses";
import findSpouse from "./findSpouse";
import insertExSpouseMain from "./insertExSpouseMain";
import insertSpouseMain from "./insertSpouseMain";
import mainBranch from "./mainBranch";
import personKidPlace from "./personKidPlace";
import { IPersonCard } from '../../models/psnCardType'
import { ISpouseType } from '../../models/spousesType'
import { IExspouseType } from '../../models/exsposesType'
import { constRelTree } from "../Relatives/constRelTree";

const rightBranch2 = (
  rightMainPerson:IPersonCard,
  arrAllRelPersons:IPersonCard[],
  spouses:ISpouseType[],
  exspouses:IExspouseType[]
) => {
  const dad = rightMainPerson.dad;
  const mom = rightMainPerson.mother;
  const personLongname = rightMainPerson.longname;

  let brothersAndSisters:IPersonCard[] = [];
  let objPerson = null;
  let objSpouse = null;

  // найти в массиве родителей
  let indexDad = -1;
  let indexMom = -1;
  if (dad) {
    indexDad = arrAllRelPersons.findIndex((elem) => elem.longname === dad);
  }
  if (mom) {
    indexMom = arrAllRelPersons.findIndex((elem) => elem.longname === mom);
  }

  if (indexDad > -1 && indexMom > -1) {
    brothersAndSisters = arrAllRelPersons.filter(
      (elem) =>
        elem.dad === dad &&
        elem.mother === mom &&
        elem.longname !== personLongname
    );
    objPerson = arrAllRelPersons[indexDad];
    objSpouse = arrAllRelPersons[indexMom];
  } else if (indexDad > -1 && indexMom === -1) {
    brothersAndSisters = arrAllRelPersons.filter(
      (elem) => elem.dad === dad && elem.longname !== personLongname
    );
    objPerson = arrAllRelPersons[indexDad];
  } else if (indexDad === -1 && indexMom > -1) {
    brothersAndSisters = arrAllRelPersons.filter(
      (elem) =>
        elem.mother === mom && elem.longname !== personLongname && !elem.dad
    );
    objPerson = arrAllRelPersons[indexMom];
  } else {
    return arrAllRelPersons;
  }

  let amountBrothersAndSisters = brothersAndSisters.length;
  if (amountBrothersAndSisters > 0) {
    for (let i = 0; i < amountBrothersAndSisters; i++) {
      // проверить, что еще не размещен(-на)
      let indexPsnInArr = arrAllRelPersons.findIndex(
        (elem) =>
          elem.longname === brothersAndSisters[i].longname && elem.level > 0
      );
      if (indexPsnInArr > -1) {
        arrAllRelPersons[indexPsnInArr].lineColor = constRelTree.lineColor;
      } else {
        arrAllRelPersons = personKidPlace(
          objPerson,
          objSpouse,
          brothersAndSisters[i],
          amountBrothersAndSisters,
          arrAllRelPersons,
          spouses
        );

        // если персона - мужчина, начиная с экс жен, если - женщина  - с мужа
        if (brothersAndSisters[i].gender === "Man") {
          // найти бывших жен 4-ого уровня
          let personExWifes4 = findExSpouses(
            brothersAndSisters[i],
            arrAllRelPersons,
            exspouses
          );

          // вставить каждую и начать ветку
          if (personExWifes4.length > 0) {
            for (let k = 0; k < personExWifes4.length; k++) {
              arrAllRelPersons = insertExSpouseMain(
                brothersAndSisters[i],
                personExWifes4[k],
                arrAllRelPersons
              );
              // начать ветку
              arrAllRelPersons = mainBranch(
                brothersAndSisters[i],
                personExWifes4[k],
                arrAllRelPersons,
                spouses,
                exspouses
              );
            }
          }
          // вставляю жену
          let objPersonWife = findSpouse(
            brothersAndSisters[i],
            arrAllRelPersons,
            spouses
          );
          if (objPersonWife) {
            arrAllRelPersons = insertSpouseMain(
              brothersAndSisters[i],
              objPersonWife,
              arrAllRelPersons
            );
            // начать ветку
            arrAllRelPersons = mainBranch(
              brothersAndSisters[i],
              objPersonWife,
              arrAllRelPersons,
              spouses,
              exspouses
            );
          }
          // случай, когда о втором родителе нет инфо
          if (!personExWifes4 && !objPersonWife) {
          }
        } else {
          // найти мужа уровня 4
          let objPersonHusband = findSpouse(
            brothersAndSisters[i],
            arrAllRelPersons,
            spouses
          );
          // вставить мужа
          if (objPersonHusband) {
            arrAllRelPersons = insertSpouseMain(
              brothersAndSisters[i],
              objPersonHusband,
              arrAllRelPersons
            );
            // начать ветку
            arrAllRelPersons = mainBranch(
              brothersAndSisters[i],
              objPersonHusband,
              arrAllRelPersons,
              spouses,
              exspouses
            );
          }
          // найти в массиве бывших мужей 4-ого уровня
          let personExHusbands4 = findExSpouses(
            brothersAndSisters[i],
            arrAllRelPersons,
            exspouses
          );

          // вставить каждого и начать ветку
          if (personExHusbands4.length > 0) {
            for (let k = 0; k < personExHusbands4.length; k++) {
              arrAllRelPersons = insertExSpouseMain(
                brothersAndSisters[i],
                personExHusbands4[k],
                arrAllRelPersons
              );
              // начать ветку
              arrAllRelPersons = mainBranch(
                brothersAndSisters[i],
                personExHusbands4[k],
                arrAllRelPersons,
                spouses,
                exspouses
              );
            }
          }

          // случай, когда о втором родителе нет инфо
          if (!personExHusbands4 && !objPersonHusband) {
          }
        }
      }
    }
  }

  return arrAllRelPersons;
};
export default rightBranch2;
