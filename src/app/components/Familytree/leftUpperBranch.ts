import findExSpouses from "./findExSpouses";
import findSpouse from "./findSpouse";
import { constRelTree } from "@/app/components/Relatives/constRelTree";
import personKidPlaceLeft from "./personKidPlaceLeft";
import insertSpouseLeftUp from "./insertSpouseLeftUp";
import insertExSpouseLeftUp from "./insertExSpouseLeftUp";
import leftBranchStep2 from "./leftBranchStep2";
import mainBranchKids from "./mainBranchKids";
import { IPersonCard } from '../../models/psnCardType'
import { ISpouseType } from '../../models/spousesType'
import { IExspouseType } from '../../models/exsposesType'

const leftUpperBranch = (
  objPerson:IPersonCard | null,
  objSpouse:IPersonCard | null,
  arrAllPersons:IPersonCard[],
  spouses:ISpouseType[],
  exspouses:IExspouseType[],
  lineColor = constRelTree.lineColorUp1
) => {
  if (!objPerson) {
    return arrAllPersons;
  }

  //const personGender = objPerson.gender;
  //const isPersonMan = personGender === "Man" ? true : false;
  const defaultColor = constRelTree.lineColor;
  let arrPersonKids = [];

  arrPersonKids = mainBranchKids(objPerson, objSpouse, arrAllPersons);
  

  let kidsAmount = arrPersonKids.length;
  if (kidsAmount === 0) {
    return arrAllPersons;
  }
  arrPersonKids.sort((a:IPersonCard, b:IPersonCard) => a.pozX - b.pozX);
  arrPersonKids.forEach((elem:IPersonCard) => {
    let j = arrAllPersons.findIndex((el) => el.longname === elem.longname);
    arrAllPersons[j].lineColor = j !== -1 ? lineColor : defaultColor;
  });

  for (let indexKid = 0; indexKid < kidsAmount; indexKid++) {
    arrAllPersons = personKidPlaceLeft(
      objPerson,
      objSpouse,
      arrPersonKids[indexKid],
      arrAllPersons
    );
    // для каждого
    // если персона - мужчина, начиная с жен
    if (arrPersonKids[indexKid].gender === "Man") {
      // вставляю жену
      let objPersonWife = findSpouse(
        arrPersonKids[indexKid],
        arrAllPersons,
        spouses
      );
      if (objPersonWife) {
        arrAllPersons = insertSpouseLeftUp(
          arrPersonKids[indexKid],
          objPersonWife,
          arrAllPersons
        );
        // начать ветку
        arrAllPersons = leftBranchStep2(
          arrPersonKids[indexKid],
          objPersonWife,
          arrAllPersons,
          spouses,
          exspouses
        );
      }
      // найти экс-жен
      let personExWifes2 = findExSpouses(
        arrPersonKids[indexKid],
        arrAllPersons,
        exspouses
      );
      // вставить каждую и начать ветку
      if (personExWifes2.length > 0) {
        for (
          let indexExSpouse = 0;
          indexExSpouse < personExWifes2.length;
          indexExSpouse++
        ) {
          arrAllPersons = insertExSpouseLeftUp(
            arrPersonKids[indexKid],
            personExWifes2[indexExSpouse],
            arrAllPersons
          );
          // начать ветки
          arrAllPersons = leftBranchStep2(
            arrPersonKids[indexKid],
            personExWifes2[indexExSpouse],
            arrAllPersons,
            spouses,
            exspouses
          );
        }
      }
    } else {
      // сначала вставить экс-мужей
      let personExHusbands2 = findExSpouses(
        arrPersonKids[indexKid],
        arrAllPersons,
        exspouses
      );
      if (personExHusbands2.length > 0) {
        for (
          let indexExSpouse = 0;
          indexExSpouse < personExHusbands2.length;
          indexExSpouse++
        ) {
          arrAllPersons = insertExSpouseLeftUp(
            arrPersonKids[indexKid],
            personExHusbands2[indexExSpouse],
            arrAllPersons
          );
          // начать ветки
          arrAllPersons = leftBranchStep2(
            arrPersonKids[indexKid],
            personExHusbands2[indexExSpouse],
            arrAllPersons,
            spouses,
            exspouses
          );
        }
      }

      // найти мужа
      let objPersonHusband = findSpouse(
        arrPersonKids[indexKid],
        arrAllPersons,
        spouses
      );
      // вставить мужа
      if (objPersonHusband) {
        arrAllPersons = insertSpouseLeftUp(
          arrPersonKids[indexKid],
          objPersonHusband,
          arrAllPersons
        );
        // начать ветку
        arrAllPersons = leftBranchStep2(
          arrPersonKids[indexKid],
          objPersonHusband,
          arrAllPersons,
          spouses,
          exspouses
        );
      }
    }
  }

  return arrAllPersons;
};
export default leftUpperBranch;
