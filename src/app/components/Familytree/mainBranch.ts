import findExSpouses from "./findExSpouses";
import findSpouse from "./findSpouse";
import insertExSpouseMain from "./insertExSpouseMain";
import insertSpouseMain from "./insertSpouseMain";
import mainBranchStep2 from "./mainBranchStep2";
import personKidPlace from "./personKidPlace";
import { IPersonCard } from '../../models/psnCardType'
import { ISpouseType } from '../../models/spousesType'
import { IExspouseType } from '../../models/exsposesType'

const mainBranch = (
  objPerson:IPersonCard,
  objSpouse:IPersonCard,
  arrAllPersons:IPersonCard[],
  spouses:ISpouseType[],
  exspouses:IExspouseType[]
) => {
  // пара родителей (второй родитель м.б. не известен) из 4-ого уровня
  // надо построить каскадно 5-ой уровнь

  const personGender = objPerson.gender;
  const isPersonMan = personGender === "Man" ? true : false;
  let arrPersonKids:IPersonCard[] = [];
  let dad = "";
  let mom = "";
  if (objSpouse) {
    dad = isPersonMan ? objPerson.longname : objSpouse.longname;
    mom = isPersonMan ? objSpouse.longname : objPerson.longname;
  } else {
    dad = isPersonMan ? objPerson.longname : "";
    mom = isPersonMan ? "" : objPerson.longname;
  }

  // выбрать детей персоны
  if (dad && mom) {
    arrPersonKids = arrAllPersons.filter(
      (elem) => elem.dad === dad && elem.mother === mom
    );
  } else if (dad && !mom) {
    arrPersonKids = arrAllPersons.filter(
      (elem) => elem.dad === dad && !elem.mother
    );
  } else if (!dad && mom) {
    arrPersonKids = arrAllPersons.filter(
      (elem) => !elem.dad && elem.mother === mom
    );
  } else {
    return arrAllPersons;
  }

  let N = arrPersonKids.length;
  if (N === 0) {
    return arrAllPersons;
  }
  arrPersonKids.sort((a, b) => a.pozX - b.pozX);

  for (let i = 0; i < arrPersonKids.length; i++) {
    // проверить, что еще не размещен(-на)
    let indexPsnInArr = arrAllPersons.findIndex(
      (elem) => elem.longname === arrPersonKids[i].longname && elem.level > 0
    );
    if (indexPsnInArr > -1) {
      arrAllPersons[indexPsnInArr].lineColor = "brown";
    } else {
      arrAllPersons = personKidPlace(
        objPerson,
        objSpouse,
        arrPersonKids[i],
        N,
        arrAllPersons,
        spouses
      );
      // если персона - мужчина, начиная с экс жен, если - женщина  - с мужа
      if (arrPersonKids[i].gender === "Man") {
        // найти бывших жен 5-ого уровня
        let personExWifes5 = findExSpouses(
          arrPersonKids[i],
          arrAllPersons,
          exspouses
        );

        // вставить каждую и начать ветку
        if (personExWifes5.length > 0) {
          for (let k = 0; k < personExWifes5.length; k++) {
            arrAllPersons = insertExSpouseMain(
              arrPersonKids[i],
              personExWifes5[k],
              arrAllPersons
            );
            // начать ветку
            arrAllPersons = mainBranchStep2(
              arrPersonKids[i],
              personExWifes5[k],
              arrAllPersons,
              spouses,
              exspouses
            );
          }
        }
        // вставляю жену
        let objPersonWife = findSpouse(
          arrPersonKids[i],
          arrAllPersons,
          spouses
        );
        if (objPersonWife) {
          arrAllPersons = insertSpouseMain(
            arrPersonKids[i],
            objPersonWife,
            arrAllPersons
          );
          // начать ветку
          arrAllPersons = mainBranchStep2(
            arrPersonKids[i],
            objPersonWife,
            arrAllPersons,
            spouses,
            exspouses
          );
        }
        // случай, когда о втором родителе нет инфо
        if (!personExWifes5 && !objPersonWife) {
        }
      } else {
        // найти мужа уровня 5
        let objPersonHusband = findSpouse(
          arrPersonKids[i],
          arrAllPersons,
          spouses
        );
        // вставить мужа
        if (objPersonHusband) {
          arrAllPersons = insertSpouseMain(
            arrPersonKids[i],
            objPersonHusband,
            arrAllPersons
          );
          // начать ветку
          arrAllPersons = mainBranchStep2(
            arrPersonKids[i],
            objPersonHusband,
            arrAllPersons,
            spouses,
            exspouses
          );
        }
        // найти в массиве бывших мужей 5-ого уровня
        let personExHusbands5 = findExSpouses(
          arrPersonKids[i],
          arrAllPersons,
          exspouses
        );

        // вставить каждого и начать ветку
        if (personExHusbands5.length > 0) {
          for (let k = 0; k < personExHusbands5.length; k++) {
            arrAllPersons = insertExSpouseMain(
              arrPersonKids[i],
              personExHusbands5[k],
              arrAllPersons
            );
            // начать ветку
            arrAllPersons = mainBranchStep2(
              arrPersonKids[i],
              personExHusbands5[k],
              arrAllPersons,
              spouses,
              exspouses
            );
          }
        }
        // случай, когда о втором родителе нет инфо
        if (!personExHusbands5 && !objPersonHusband) {
        }
      }
    }
  }

  return arrAllPersons;
};

export default mainBranch;
