import personKidPlaceLeft from "./personKidPlaceLeft";
import findSpouse from "./findSpouse";
import insertSpouseLeftBranch from "./insertSpouseLeftBranch";
import findExSpouses from "./findExSpouses";
import insertExSpouseLeftUp from "./insertExSpouseLeftUp";
import leftBranchStep2 from "./leftBranchStep2";
import { IPersonCard } from "../../models/psnCardType";
import { ISpouseType } from "../../models/spousesType";
import { IExspouseType } from "../../models/exsposesType";

const leftBranch = (mainLeftPsn: IPersonCard, arrAllRelPersons: IPersonCard[],
  spouses: ISpouseType[], exspouses:IExspouseType[]) => {
  //первая левая ветвь ...
  if (!mainLeftPsn) {
    return arrAllRelPersons;
  }

  const dad = mainLeftPsn.dad;
  const mom = mainLeftPsn.mother;
  const personLongname = mainLeftPsn.longname;

  let brothersAndSisters:IPersonCard[] = [];
  let objPerson:IPersonCard;
  let objSpouse:IPersonCard | null = null;

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
      arrAllRelPersons = personKidPlaceLeft(
        objPerson,
        objSpouse,
        brothersAndSisters[i],
        arrAllRelPersons
      );

      // если размещен брат
      if (brothersAndSisters[i].gender === "Man") {
        // найти жену
        let objPersonWife = findSpouse(
          brothersAndSisters[i],
          arrAllRelPersons,
          spouses
        );
        if (objPersonWife) {
          // разместить жену
          arrAllRelPersons = insertSpouseLeftBranch(
            brothersAndSisters[i],
            objPersonWife,
            arrAllRelPersons
          );
          // начать ветку
          arrAllRelPersons = leftBranchStep2(
            brothersAndSisters[i],
            objPersonWife,
            arrAllRelPersons,
            spouses,
            exspouses
          );
        }
        // найти и разместить экс-жен
        let personExWifes = findExSpouses(
          brothersAndSisters[i],
          arrAllRelPersons,
          exspouses
        );

        // вставить каждую и начать ветку
        if (personExWifes.length > 0) {
          for (
            let numExSpouse = 0;
            numExSpouse < personExWifes.length;
            numExSpouse++
          ) {
            arrAllRelPersons = insertExSpouseLeftUp(
              brothersAndSisters[i],
              personExWifes[numExSpouse],
              arrAllRelPersons
            );
            arrAllRelPersons = leftBranchStep2(
              brothersAndSisters[i],
              personExWifes[numExSpouse],
              arrAllRelPersons,
              spouses,
              exspouses
            );
          }
        }
        // случай, когда о втором родителе нет инфо
        if (!objPersonWife && personExWifes.length === 0) {
          arrAllRelPersons = leftBranchStep2(
            brothersAndSisters[i],
            null,
            arrAllRelPersons,
            spouses,
            exspouses
          );
        }
      } else {
        // размещена сестра
        // разместить экс-мужей
        let personExHusbands = findExSpouses(
          brothersAndSisters[i],
          arrAllRelPersons,
          exspouses
        );
        if (personExHusbands.length > 0) {
          for (
            let numExSpouse = 0;
            numExSpouse < personExHusbands.length;
            numExSpouse++
          ) {
            arrAllRelPersons = insertExSpouseLeftUp(
              brothersAndSisters[i],
              personExHusbands[numExSpouse],
              arrAllRelPersons
            );
            // начать ветку
            arrAllRelPersons = leftBranchStep2(
              brothersAndSisters[i],
              personExHusbands[numExSpouse],
              arrAllRelPersons,
              spouses,
              exspouses
            );
          }
        }
        // найти мужа
        let objPersonHusband = findSpouse(
          brothersAndSisters[i],
          arrAllRelPersons,
          spouses
        );
        if (objPersonHusband) {
          // разместить мужа
          arrAllRelPersons = insertSpouseLeftBranch(
            brothersAndSisters[i],
            objPersonHusband,
            arrAllRelPersons
          );
          // начать ветку
          arrAllRelPersons = leftBranchStep2(
            brothersAndSisters[i],
            objPersonHusband,
            arrAllRelPersons,
            spouses,
            exspouses
          );
        }
        // случай, когда о втором родителе нет инфо
        if (!objPersonHusband && personExHusbands.length === 0) {
          arrAllRelPersons = leftBranchStep2(
            brothersAndSisters[i],
            null,
            arrAllRelPersons,
            spouses,
            exspouses
          );
        }
      }
    }
  }

  return arrAllRelPersons;
};
export default leftBranch;
