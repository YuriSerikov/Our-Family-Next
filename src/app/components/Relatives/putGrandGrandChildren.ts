import culcPozxKids from "./culcPozxKids";
import { constRelTree } from "./constRelTree";
import { IPersonCard } from "../../models/psnCardType";
import { ISpouseType } from "../../models/spousesType";
import { IExspouseType } from "../../models/exsposesType";

const putGrandGrandChildren = (
  keyPsnMain:IPersonCard,
  secondParentLongname: string,
  arrAllRelPersons:IPersonCard[],
  spouses:ISpouseType[],
  exspouses:IExspouseType[],
  nextLevel: number,
  pozY: number,
  arrSmallTree: IPersonCard[],
  xMiddlePoint: number
) => {
  const keyPersonGender = keyPsnMain.gender;
  const psnLongname = keyPsnMain.longname;
  const xMainPerson = keyPsnMain.pozX;
  const mgn = constRelTree.marginCard;
  const gridStepX = mgn + constRelTree.miniWidth;

  const addAttributes = (arrKids:IPersonCard[], nextLevel:number, pozY:number) => {
    if (arrKids.length > 0) {
      for (let k = 0; k < arrKids.length; k++) {
        arrKids[k].pozY = pozY;
        arrKids[k].level = nextLevel;
      }
    }
    return arrKids;
  };
  //
  if (keyPersonGender === "Man") {
    // 1. Правнуки: мужской алгоритм
    // с женой и бывшими женами

    if (secondParentLongname !== "noInfo") {
      const dadLongname = psnLongname;
      const momLongname = secondParentLongname;

      let arrKids = arrAllRelPersons.filter(
        (elem) =>
          elem.level === 0 &&
          elem.dad === dadLongname &&
          elem.mother === momLongname
      );
      //console.log(arrKids);
      let n = arrKids.length > 0 ? arrKids.length : 0;
      if (n > 0) {
        arrKids = addAttributes(arrKids, nextLevel, pozY);
        let xLeftPsn;
        let j = arrAllRelPersons.findIndex(
          (elem) => elem.longname === momLongname
        );

        if (j > -1) {
          xLeftPsn = arrAllRelPersons[j].pozX;
          // если экс-жена
          let j1 = exspouses.findIndex(
            (elem) =>
              elem.ex_husband === dadLongname && elem.ex_wife === momLongname
          );
          if (j1 > -1) {
            // общие дети с экс-женой
            if (j > -1) {
              xLeftPsn = arrAllRelPersons[j].pozX;

              arrSmallTree = culcPozxKids(
                arrKids,
                arrSmallTree,
                xLeftPsn,
                xLeftPsn + constRelTree.miniWidth,
                xMainPerson
              );
            }
          } else {
            // жена
            let j2 = spouses.findIndex(
              (elem) =>
                elem.husband === dadLongname && elem.wife === momLongname
            );
            if (j2 > -1) {
              arrSmallTree = culcPozxKids(
                arrKids,
                arrSmallTree,
                xMainPerson,
                xLeftPsn + gridStepX,
                xMainPerson
              );
            }
          }
        }
      }
    } else if (secondParentLongname === "noInfo") {
      // 4. нет инфо о матери
      let arrKids = arrAllRelPersons.filter(
        (elem) => elem.level === 0 && elem.dad === psnLongname && !elem.mother
      );
      let n = arrKids.length > 0 ? arrKids.length : 0;
      if (n > 0) {
        // размещение в уровне nextLevel
        arrKids = addAttributes(arrKids, nextLevel, pozY);

        arrSmallTree = culcPozxKids(
          arrKids,
          arrSmallTree,
          xMainPerson,
          xMainPerson + constRelTree.miniWidth,
          0
        );
      }
    }
  } else {
    // 2. Правнуки: женский алгоритм.
    if (secondParentLongname !== "noInfo") {
      const dadLongname = secondParentLongname;
      const momLongname = psnLongname;
      //console.log("dadLongname=", dadLongname);
      //console.log("momLongname=", momLongname);

      let arrKids = arrAllRelPersons.filter(
        (elem) =>
          elem.level === 0 &&
          elem.dad === dadLongname &&
          elem.mother === momLongname
      );
      let n = arrKids.length > 0 ? arrKids.length : 0;
      if (n > 0) {
        arrKids = addAttributes(arrKids, nextLevel, pozY);
        // если второй родитель - муж
        let j = spouses.findIndex(
          (elem) => elem.husband === dadLongname && elem.wife === momLongname
        );
        let j2 = exspouses.findIndex(
          (elem) =>
            elem.ex_husband === dadLongname && elem.ex_wife === momLongname
        );

        if (j > -1) {
          // общие дети с мужем
          arrSmallTree = culcPozxKids(
            arrKids,
            arrSmallTree,
            xMainPerson - gridStepX,
            xMainPerson + gridStepX,
            0
          );
        } else {
          if (j2 > -1) {
            // общие дети с экс-муж
            let j1 = arrSmallTree.findIndex(
              (elem) => elem.longname === dadLongname
            );
            if (j1 > -1) {
              let xDadPoz = arrSmallTree[j1].pozX;
              //console.log("xDadPoz=", xDadPoz);
              arrSmallTree = culcPozxKids(
                arrKids,
                arrSmallTree,
                xDadPoz,
                xDadPoz + constRelTree.miniWidth,
                xDadPoz
              );
            }
          }
        }
      }
    } else if (secondParentLongname === "noInfo") {
      // 4. нет инфо об отце
      let arrKids = arrAllRelPersons.filter(
        (elem) => elem.level === 0 && !elem.dad && elem.mother === psnLongname
      );
      let n = arrKids.length > 0 ? arrKids.length : 0;
      if (n > 0) {
        arrKids = addAttributes(arrKids, nextLevel, pozY);
        // размещение в уровне nextLevel
        arrSmallTree = culcPozxKids(
          arrKids,
          arrSmallTree,
          xMainPerson,
          xMainPerson + constRelTree.miniWidth,
          0
        );
      }
    }
  }
  return arrSmallTree;
};
export default putGrandGrandChildren;
