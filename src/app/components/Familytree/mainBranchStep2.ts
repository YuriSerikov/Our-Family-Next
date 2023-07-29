import findExSpouses from "./findExSpouses";
import findSpouse from "./findSpouse";
import insertExSpouseMain from "./insertExSpouseMain";
import insertSpouseMain from "./insertSpouseMain";
import mainBranchKids from "./mainBranchKids";
import mainBranchStep3 from "./mainBranchStep3";
import personKidPlace from "./personKidPlace";
import { IPersonCard } from '../../models/psnCardType'
import { ISpouseType } from '../../models/spousesType'
import { IExspouseType } from '../../models/exsposesType'

const mainBranchStep2 = (
  objPerson:IPersonCard,
  objSpouse:IPersonCard | null,
  arrAllPersons:IPersonCard[],
  spouses:ISpouseType[],
  exspouses:IExspouseType[]
) => {
  if (!objPerson) {
    return arrAllPersons;
  }
  // пара родителей (второй родитель м.б. не известен) из 5-ого уровня
  // надо построить каскадно 6-ой уровнь
  
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
      arrAllPersons[indexPsnInArr].lineColor = "brown";
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
        // найти бывших жен 6-ого уровня
        let personExWifes6 = findExSpouses(
          arrPersonKids[numKid],
          arrAllPersons,
          exspouses
        );
         
        // вставить каждую и начать ветку
        if (personExWifes6.length > 0) {
          for (
            let numExSpouse = 0;
            numExSpouse < personExWifes6.length;
            numExSpouse++
          ) {
             
            arrAllPersons = insertExSpouseMain(
              arrPersonKids[numKid],
              personExWifes6[numExSpouse],
              arrAllPersons
            );
            // начать ветку
            arrAllPersons = mainBranchStep3(
              arrPersonKids[numKid],
              personExWifes6[numExSpouse],
              arrAllPersons,
              spouses,
              exspouses
            );
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
          // начать ветку
          arrAllPersons = mainBranchStep3(
            arrPersonKids[numKid],
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
          // начать ветку
          arrAllPersons = mainBranchStep3(
            arrPersonKids[numKid],
            objPersonHusband,
            arrAllPersons,
            spouses,
            exspouses
          );
        }
        // найти в массиве бывших мужей 6-ого уровня
        let personExHusbands6 = findExSpouses(
          arrPersonKids[numKid],
          arrAllPersons,
          exspouses
        );

        // вставить каждого и
        if (personExHusbands6.length > 0) {
          for (
            let numExSpouse = 0;
            numExSpouse < personExHusbands6.length;
            numExSpouse++
          ) {
            arrAllPersons = insertExSpouseMain(
              arrPersonKids[numKid],
              personExHusbands6[numExSpouse],
              arrAllPersons
            );
            // начать ветку
            arrAllPersons = mainBranchStep3(
              arrPersonKids[numKid],
              personExHusbands6[numExSpouse],
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
  }
  return arrAllPersons;
};

export default mainBranchStep2;
