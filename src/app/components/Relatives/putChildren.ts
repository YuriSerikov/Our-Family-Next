import culcPozxKids from "./culcPozxKids";
import { constRelTree } from "./constRelTree";
import addSpouseAndEx from "./addSpouseAndEx";
import { IPersonCard } from "../../models/psnCardType";
import { ISpouseType } from "../../models/spousesType";
import { IExspouseType } from "../../models/exsposesType";

const putChildren = (
  keyPsnMain: IPersonCard,
  arrAllRelPersons: IPersonCard[],
  spouses: ISpouseType[],
  exspouses: IExspouseType[],
  nextLevel: number,
  pozY: number,
  arrSmallTree: IPersonCard[],
  xMiddlePoint: number
) => {
  let arrKids: IPersonCard[] = [];
  const keyPersonGender = keyPsnMain.gender;
  const psnLongname = keyPsnMain.longname;
  const xMainPerson = keyPsnMain.pozX;
  const mgn = constRelTree.marginCard;
  const gridStepX = mgn + constRelTree.miniWidth;

  const addAttributes = (arrKids: IPersonCard[], nextLevel: number, pozY: number) => {
    if (arrKids.length > 0) {
      for (let k = 0; k < arrKids.length; k++) {
        arrKids[k].pozY = pozY;
        arrKids[k].level = nextLevel;
      }
    }
    return arrKids;
  };

  if (keyPersonGender === "Man") {
    // учесть вариант, когда нет информации о женщинах, но есть инфо о детях
    let noInfoMom = true;

    // 1. дети с бывшими женами
    let exWifes = exspouses.filter((elem) => elem.ex_husband === psnLongname);
    if (exWifes.length > 0) {
      noInfoMom = false;

      for (let i = 0; i < exWifes.length; i++) {
        let momLongname = exWifes[i].ex_wife;
        arrKids = arrAllRelPersons.filter(
          (elem) =>
            elem.level === 0 &&
            elem.dad === psnLongname &&
            elem.mother === momLongname
        );
        let n = arrKids.length > 0 ? arrKids.length : 0;
        if (n > 0) {
          arrKids = addAttributes(arrKids, nextLevel, pozY);
          // размещение в уровне nextLevel
          let j = arrAllRelPersons.findIndex(
            (elem) => elem.longname === momLongname
          );
          let xLeftPsn;
          if (j > -1) {
            xLeftPsn = arrAllRelPersons[j].pozX;

            arrSmallTree = culcPozxKids(
              arrKids,
              arrSmallTree,
              xLeftPsn,
              xLeftPsn + constRelTree.miniWidth,
              xMiddlePoint
            );
          }
        }
      }
    }
    // 2. дети с женой
    let wifes = spouses.filter((elem) => elem.husband === psnLongname);

    if (wifes.length > 0) {
      noInfoMom = false;
      let momLongname = wifes[0].wife;

      arrKids = arrAllRelPersons.filter(
        (elem) =>
          elem.level === 0 &&
          elem.dad === psnLongname &&
          elem.mother === momLongname
      );
      let n = arrKids.length > 0 ? arrKids.length : 0;

      if (n > 0) {
        arrKids = addAttributes(arrKids, nextLevel, pozY);

        // размещение в уровне nextLevel
        let j = arrAllRelPersons.findIndex(
          (elem) => elem.longname === momLongname
        );

        if (j > -1) {
          let xLeftWife = arrAllRelPersons[j].pozX;

          arrSmallTree = culcPozxKids(
            arrKids,
            arrSmallTree,
            xMainPerson,
            xLeftWife + gridStepX,
            xMiddlePoint
          );
        }
      }
    }
    // 3. нет инфо о матери
    if (noInfoMom) {
      arrKids = arrAllRelPersons.filter(
        (elem) => elem.level === 0 && elem.dad === psnLongname
      );

      if (arrKids.length > 0) {
        // размещение в уровне nextLevel
        arrKids = addAttributes(arrKids, nextLevel, pozY);

        arrSmallTree = culcPozxKids(
          arrKids,
          arrSmallTree,
          xMainPerson,
          xMainPerson + constRelTree.miniWidth,
          xMiddlePoint
        );
      }
    }
    // 4. общие дети жены с другими мужьями
    if (wifes.length > 0) {
      let wifeLongname = wifes[0].wife;
      let exHusbands = exspouses.filter(
        (elem) => elem.ex_wife === wifeLongname
      );

      if (exHusbands.length > 0) {
        for (let i = 0; i < exHusbands.length; i++) {
          let dadLongname = exHusbands[i].ex_husband;
          arrKids = arrAllRelPersons.filter(
            (elem) =>
              elem.level === 0 &&
              elem.dad === dadLongname &&
              elem.mother === wifeLongname
          );

          if (arrKids.length > 0) {
            arrKids = addAttributes(arrKids, nextLevel, pozY);
            // размещение в уровне nextLevel
            let j = arrAllRelPersons.findIndex(
              (elem) => elem.longname === dadLongname
            );
            let xLeftDad: number = 0;
            if (j > -1) {
              xLeftDad = arrAllRelPersons[j].pozX;
            }
            arrSmallTree = culcPozxKids(
              arrKids,
              arrSmallTree,
              xMainPerson + constRelTree.miniWidth,
              xLeftDad + constRelTree.miniWidth,
              xMiddlePoint
            );
          }
        }
      }
    }
  } else {
    // Дети: женский алгоритм.
    let noInfoDad = true;
    let exHusbands = exspouses.filter((elem) => elem.ex_wife === psnLongname);
    let husbands = spouses.filter((elem) => elem.wife === psnLongname);
    let husbandLongname: string;

    // 1. Начинаю с экс-жен мужа, если он есть
    if (husbands.length > 0) {
      noInfoDad = false;
      husbandLongname = husbands[0].husband;
      let exWifes = exspouses.filter(
        (elem) => elem.ex_husband === husbandLongname
      );
      if (exWifes.length > 0) {
        for (let i = 0; i < exWifes.length; i++) {
          let momLongname = exWifes[i].ex_wife;
          arrKids = arrAllRelPersons.filter(
            (elem) =>
              elem.level === 0 &&
              elem.dad === husbandLongname &&
              elem.mother === momLongname
          );

          if (arrKids.length > 0) {
            arrKids = addAttributes(arrKids, nextLevel, pozY);
            // размещение в уровне nextLevel
            /* let j = arrAllRelPersons.findIndex(
              (elem) => elem.longname === momLongname
            );
            let xLeftMom;
            if (j > -1) {
              xLeftMom = arrAllRelPersons[j].pozX;
            } */
            let xLeftMom = xMainPerson - gridStepX * (i + 1);
            xLeftMom = xLeftMom < 0 ? 0 : xLeftMom;
            arrSmallTree = culcPozxKids(
              arrKids,
              arrSmallTree,
              xLeftMom,
              xMainPerson - mgn,
              xMainPerson - gridStepX
            );
          }
        }
      }
    }
    // 2. общие дети с супругом
    if (husbands.length > 0) {
      noInfoDad = false;
      arrKids = arrAllRelPersons.filter(
        (elem) =>
          elem.level === 0 &&
          elem.dad === husbandLongname &&
          elem.mother === psnLongname
      );

      if (arrKids.length > 0) {
        // размещение в уровне nextLevel
        arrKids = addAttributes(arrKids, nextLevel, pozY);

        let j = arrAllRelPersons.findIndex(
          (elem) => elem.longname === husbandLongname
        );
        let xLeftDad;
        if (j > -1) {
          xLeftDad = arrAllRelPersons[j].pozX;
       
          arrSmallTree = culcPozxKids(
            arrKids,
            arrSmallTree,
            xLeftDad,
            xMainPerson + gridStepX,
            xMainPerson - gridStepX
            );
        }
      }
    }

    // 3. дети с бывшими мужьями
    if (exHusbands.length > 0) {
      noInfoDad = false;

      for (let i = 0; i < exHusbands.length; i++) {
        let dadLongname = exHusbands[i].ex_husband;
        arrKids = arrAllRelPersons.filter(
          (elem) =>
            elem.level === 0 &&
            elem.dad === dadLongname &&
            elem.mother === psnLongname
        );
        let n = arrKids.length > 0 ? arrKids.length : 0;
        if (n > 0) {
          arrKids = addAttributes(arrKids, nextLevel, pozY);
          // размещение в уровне nextLevel
          let j = arrAllRelPersons.findIndex(
            (elem) => elem.longname === dadLongname
          );
          let xLeftDad = 0;
          if (j > -1) {
            xLeftDad = arrAllRelPersons[j].pozX;
          }
          arrSmallTree = culcPozxKids(
            arrKids,
            arrSmallTree,
            xLeftDad,
            xLeftDad + constRelTree.miniWidth,
            xMainPerson - gridStepX
          );
        }
      }
    }

    // 4. нет инфо об отце
    if (noInfoDad) {
      arrKids = arrAllRelPersons.filter(
        (elem) => elem.level === 0 && elem.mother === psnLongname
      );

      if (arrKids.length > 0) {
        arrKids = addAttributes(arrKids, nextLevel, pozY);
        // размещение в уровне nextLevel
        arrSmallTree = culcPozxKids(
          arrKids,
          arrSmallTree,
          xMainPerson,
          xMainPerson + constRelTree.miniWidth,
          xMainPerson - gridStepX
        );
      }
    }
  }
  // добавить супругов людей в 4-ом уровене ("Дети")
  // начиная с самого левого человека
  let arrPersonsLevel4 = arrSmallTree.filter((person) => person.level === 4);
  let arrPersonsOther = arrSmallTree.filter((person) => person.level !== 4);
  if (arrPersonsLevel4.length > 0) {
    // отсортировать по возрастанию позиции Х
    arrPersonsLevel4.sort((a, b) => a.pozX - b.pozX);
    arrSmallTree = arrPersonsOther.concat(arrPersonsLevel4);

    arrSmallTree = addSpouseAndEx(
      arrSmallTree,
      spouses,
      exspouses,
      arrAllRelPersons,
      nextLevel,
      xMiddlePoint
    );
  }

  return arrSmallTree;
};
export default putChildren;
