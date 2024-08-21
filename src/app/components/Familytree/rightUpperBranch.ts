import findExSpouses from "./findExSpouses";
import findSpouse from "./findSpouse";
import insertExSpouseMain from "./insertExSpouseMain";
import insertSpouseMain from "./insertSpouseMain";
import mainBranchStep2 from "./mainBranchStep2";
import personKidPlace from "./personKidPlace";
import { constRelTree } from "@/app/components/Relatives/constRelTree";
import mainBranchKids from "./mainBranchKids";
import { IPersonCard } from "../../models/psnCardType";
import { ISpouseType } from "../../models/spousesType";
import { IExspouseType } from "../../models/exsposesType";

const rightUpperBranch = (
  objPerson: IPersonCard | null,
  objSpouse: IPersonCard | null,
  arrAllPersons: IPersonCard[],
  spouses: ISpouseType[],
  exspouses: IExspouseType[],
  lineColor = constRelTree.lineColorUp1  //"green"
) => {
  // пара родителей (второй родитель м.б. не известен) из 1-ого уровня
  // надо построить каскадно потомков: 2-ой, 3-й, 4-й и 5-й уровнь, правее всех уже размещенных

  const defaultColor = constRelTree.lineColor;
  let arrPersonKids = [];
  arrPersonKids = mainBranchKids(objPerson, objSpouse, arrAllPersons);

  let kidsAmount = 0;
  kidsAmount = arrPersonKids.length;
  if (kidsAmount === 0) {
    return arrAllPersons;
  }

  arrPersonKids.forEach((elem) => {
    let j = arrAllPersons.findIndex((el:IPersonCard) => el.longname === elem.longname);
    arrAllPersons[j].lineColor = j !== -1 ? lineColor : defaultColor;
  });

  for (let numKid = 0; numKid < arrPersonKids.length; numKid++) {
    arrAllPersons = personKidPlace(
      objPerson,
      objSpouse,
      arrPersonKids[numKid],
      kidsAmount,
      arrAllPersons,
      spouses
    );
    // для каждого
    // если персона - мужчина, начиная с экс жен, если - женщина  - с мужа
    if (arrPersonKids[numKid].gender === "Man") {
      // найти бывших жен 2-ого уровня
      let personExWifes2 = [];
      personExWifes2 = findExSpouses(
        arrPersonKids[numKid],
        arrAllPersons,
        exspouses
      );

      // вставить каждую и начать ветку
      if (personExWifes2.length > 0) {
        for (
          let numExSpouse = 0;
          numExSpouse < personExWifes2.length;
          numExSpouse++
        ) {
          arrAllPersons = insertExSpouseMain(
            arrPersonKids[numKid],
            personExWifes2[numExSpouse],
            arrAllPersons
          );
          // начать ветку
          arrAllPersons = mainBranchStep2(
            arrPersonKids[numKid],
            personExWifes2[numExSpouse],
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

      arrAllPersons = insertSpouseMain(
        arrPersonKids[numKid],
        objPersonWife,
        arrAllPersons
      );
      // начать ветку
      arrAllPersons = mainBranchStep2(
        arrPersonKids[numKid],
        objPersonWife,
        arrAllPersons,
        spouses,
        exspouses
      );
      // случай, когда о втором родителе нет инфо
      if (personExWifes2.length === 0 && !objPersonWife) {
        // начать ветку
        arrAllPersons = mainBranchStep2(
          arrPersonKids[numKid],
          null,
          arrAllPersons,
          spouses,
          exspouses
        );
      }
    } else {
      // найти мужа уровня 2
      let objPersonHusband = findSpouse(
        arrPersonKids[numKid],
        arrAllPersons,
        spouses
      );
      // вставить мужа

      arrAllPersons = insertSpouseMain(
        arrPersonKids[numKid],
        objPersonHusband,
        arrAllPersons
      );
      // начать ветку
      arrAllPersons = mainBranchStep2(
        arrPersonKids[numKid],
        objPersonHusband,
        arrAllPersons,
        spouses,
        exspouses
      );
      // найти в массиве бывших мужей 2-ого уровня
      let personExHusbands2 = [];
      personExHusbands2 = findExSpouses(
        arrPersonKids[numKid],
        arrAllPersons,
        exspouses
      );

      // вставить каждого и начать ветку
      if (personExHusbands2.length > 0) {
        for (
          let numExSpouse = 0;
          numExSpouse < personExHusbands2.length;
          numExSpouse++
        ) {
          arrAllPersons = insertExSpouseMain(
            arrPersonKids[numKid],
            personExHusbands2[numExSpouse],
            arrAllPersons
          );
          // начать ветку
          arrAllPersons = mainBranchStep2(
            arrPersonKids[numKid],
            personExHusbands2[numExSpouse],
            arrAllPersons,
            spouses,
            exspouses
          );
        }
      }
      // случай, когда о втором родителе нет инфо
      if (personExHusbands2.length === 0 && !objPersonHusband) {
        // начать ветку
        arrAllPersons = mainBranchStep2(
          arrPersonKids[numKid],
          null,
          arrAllPersons,
          spouses,
          exspouses
        );
      }
    }
  }
  return arrAllPersons;
};
export default rightUpperBranch;
