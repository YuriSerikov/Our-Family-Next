import culcPozxKids from "./culcPozxKids";
import { constRelTree } from "./constRelTree";
import addSpouseAndEx_5 from "./addSpouseAndEx_5";
import { IPersonCard } from "../../models/psnCardType";
import { ISpouseType } from "../../models/spousesType";
import { IExspouseType } from "../../models/exsposesType";

const putGrandChildren = (
  keyPsnMain:IPersonCard,
  secondParentLongname: string,
  arrAllRelPersons: IPersonCard[],
  spouses:ISpouseType[],
  exspouses:IExspouseType[],
  nextLevel:number,
  pozY: number,
  arrSmallTree: IPersonCard[],
  xMiddlePoint: number
) => {
  const keyPersonGender = keyPsnMain.gender;
  const psnLongname = keyPsnMain.longname;
  const xMainPerson = keyPsnMain.pozX;
  const mgn = constRelTree.marginCard;
  const gridStepX = mgn + constRelTree.miniWidth;

  //console.log("parent level 4:", psnLongname);
  //console.log("second parent level 4:", secondParentLongname);

  const addAttributes = (arrKids:IPersonCard[], nextLevel: number, pozY: number) => {
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
    // учесть вариант, когда нет информации о женщинах, но есть инфо о детях

    // 1. дети с женой и бывшими женами
    if (secondParentLongname !== "noInfo") {
      const momLongname = secondParentLongname;
      const dadLongname = psnLongname;

      let arrKids = arrAllRelPersons.filter(
        (elem) =>
          elem.level === 0 &&
          elem.dad === dadLongname &&
          elem.mother === momLongname
      );
      let n = arrKids.length > 0 ? arrKids.length : 0;
      if (n > 0) {
        // размещение в уровне nextLevel

        arrKids = addAttributes(arrKids, nextLevel, pozY);
        let xLeftPsn;
        let j = arrAllRelPersons.findIndex(
          (elem) => elem.longname === momLongname
        );
        if (j > -1) {
          xLeftPsn = arrAllRelPersons[j].pozX;

          // если экс-жена
          // размещение детей ?

          let j1 = exspouses.findIndex(
            (elem) =>
              elem.ex_husband === dadLongname && elem.ex_wife === momLongname
          );
          let j2 = arrSmallTree.findIndex(
            (elem) => elem.longname === dadLongname
          );
          let xDadPoz = 0;
          if (j2 > -1) {
            xDadPoz = arrSmallTree[j2].pozX;
          }

          if (j1 > -1) {
            arrSmallTree = culcPozxKids(
              arrKids,
              arrSmallTree,
              xDadPoz,
              xDadPoz + constRelTree.miniWidth,
              xMainPerson
            );
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
      let arrKids = arrAllRelPersons.filter(
        (elem) => elem.level === 0 && elem.dad === psnLongname && !elem.mother
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
          xMainPerson
        );
      }
    }
  } else {
    // Дети: женский алгоритм.
    if (secondParentLongname !== "noInfo") {
      const dadLongname = secondParentLongname;
      const momLongname = psnLongname;

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

        let j2 = exspouses.findIndex(
          (elem) =>
            elem.ex_husband === dadLongname && elem.ex_wife === momLongname
        );
        let j = spouses.findIndex(
          (elem) => elem.husband === dadLongname && elem.wife === momLongname
        );

        if (j > -1) {
          arrSmallTree = culcPozxKids(
            arrKids,
            arrSmallTree,
            xMainPerson - gridStepX,
            xMainPerson + gridStepX,
            0
          );
        } else {
          // если второй родитель -  экс-муж
          //console.log(dadLongname);
          if (j2 > -1) {
            let j1 = arrSmallTree.findIndex(
              (elem) => elem.longname === dadLongname
            );
            if (j1 > -1) {
              let xDadPoz = arrSmallTree[j1].pozX;

              arrSmallTree = culcPozxKids(
                arrKids,
                arrSmallTree,
                xDadPoz,
                xDadPoz + constRelTree.miniWidth,
                0
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
          xMiddlePoint
        );
      }
    }
  }

  // добавить супругов людей в 5-ом уровене ("Дети")
  // начиная с самого левого человека
  let arrPersonsLevel5 = arrSmallTree.filter((person) => person.level === 5);
  let arrPersonsOther = arrSmallTree.filter((person) => person.level !== 5);
  if (arrPersonsLevel5.length > 0) {
    // отсортировать по возрастанию позиции Х
    arrPersonsLevel5.sort((a, b) => a.pozX - b.pozX);

    arrSmallTree = arrPersonsOther.concat(arrPersonsLevel5);
    let dadLongname =
      keyPersonGender === "Man" ? psnLongname : secondParentLongname;
    let momLongname =
      keyPersonGender === "Man" ? secondParentLongname : psnLongname;
    let arrKids5 = [];

    if (secondParentLongname !== "noInfo") {
      arrKids5 = arrPersonsLevel5.filter(
        (elem) => elem.dad === dadLongname && elem.mother === momLongname
      );
    } else {
      if (keyPersonGender === "Man") {
        arrKids5 = arrPersonsLevel5.filter(
          (elem) => elem.dad === psnLongname && !elem.mother
        );
      } else {
        arrKids5 = arrPersonsLevel5.filter(
          (elem) => !elem.dad && elem.mother === psnLongname
        );
      }
    }

    arrSmallTree = addSpouseAndEx_5(
      arrKids5,
      arrSmallTree,
      spouses,
      exspouses,
      arrAllRelPersons,
      5,
      xMiddlePoint
    );
  }

  return arrSmallTree;
};
export default putGrandChildren;
