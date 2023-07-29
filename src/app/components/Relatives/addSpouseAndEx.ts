import { constRelTree } from "./constRelTree";
import putGrandChildren from "./putGrandChildren";
import { IPersonCard } from "../../models/psnCardType";
import { ISpouseType } from "../../models/spousesType";
import { IExspouseType } from "../../models/exsposesType";

const addSpouseAndEx = (
  arrPersons: IPersonCard[],
  spouses: ISpouseType[],
  exspouses: IExspouseType[],
  arrAllRelPersons: IPersonCard[],
  level: number,
  xMiddlePoint: number
) => {
  const mgn = constRelTree.marginCard;
  const gridStepX = mgn + constRelTree.miniWidth;
  const gridStepY = constRelTree.marginY + constRelTree.miniHeight;
  let arrKids = arrPersons.filter((person) => person.level === level);

  const leftArrange = (xCurPsn: number, arrAllPersons:IPersonCard[], kidsLevel: number, xMiddlePoint:number) => {
    let xLeftEdg = Math.max(xCurPsn - 2 * gridStepX, 0);
    let xPozToArrange = xCurPsn - gridStepX;

    if (xPozToArrange < mgn) {
      // сдвинуть всю "картину" на шаг
      for (let i = 0; i < arrAllPersons.length; i++) {
        arrAllPersons[i].pozX = arrAllPersons[i].pozX + gridStepX;
      }
      xPozToArrange = xCurPsn;
    } else {
      // место свободно ?
      let index2 = arrAllPersons.findIndex(
        (elem) =>
          elem.level === kidsLevel &&
          elem.pozX >= xLeftEdg &&
          elem.pozX <= xCurPsn
      );
      if (index2 === -1) {
        // позиция свободна
        xPozToArrange = xCurPsn - gridStepX;
      } else {
        // позиция занята
        if (xCurPsn >= xMiddlePoint) {
          // сдвиг всех от персоны в уровнях === 4
          for (let i = 0; i < arrAllPersons.length; i++) {
            if (
              arrAllPersons[i].pozX >= xCurPsn &&
              arrAllPersons[i].level === 4
            ) {
              arrAllPersons[i].pozX = arrAllPersons[i].pozX + gridStepX;
            }
          }
        } else {
          // сдвиг всех от персоны в уровнях === 4
          // и сдвиг уровней меньше и равно 3
          for (let i = 0; i < arrAllPersons.length; i++) {
            if (
              (arrAllPersons[i].pozX >= xCurPsn &&
                arrAllPersons[i].level === 4) ||
              arrAllPersons[i].level <= 3
            ) {
              arrAllPersons[i].pozX = arrAllPersons[i].pozX + gridStepX;
            }
          }
        }
        xPozToArrange = xCurPsn;
      }
    }

    return xPozToArrange;
  };

  const rightArrange = (xCurPsn:number, arrAllPersons:IPersonCard[], kidsLevel:number, xMiddlePoint:number) => {
    let xPozToArrange = xCurPsn + gridStepX;

    // определить свободную позицию снизу
    // let arrLowLevels = arrAllPersons.filter((elem) => elem.level > kidsLevel);
    /* let xFreePozLowLevels = 0;
    if (arrLowLevels.length > 0) {
      for (let i = 0; i < arrLowLevels.length; i++) {
        xFreePozLowLevels = Math.max(xFreePozLowLevels, arrLowLevels[i].pozX);
      }
    } */
    // свободная позиция снизу больше позиции персоны, сдвинуть уровень от персоны на разницу
    // let xShift = xFreePozLowLevels - xCurPsn;
    //console.log("xCurPsn = ", xCurPsn);
    //console.log("xFreePozLowLevels = ", xFreePozLowLevels);
    /* if (xShift > 0) {
      for (let i = 0; i < arrAllPersons.length; i++) {
        if (
          arrAllPersons[i].level === kidsLevel &&
          arrAllPersons[i].pozX > xCurPsn
        ) {
          arrAllPersons[i].pozX = arrAllPersons[i].pozX + xShift;
        }
      }
    } */
    // место свободно?
    let indexAnyUnderArrange = arrAllPersons.findIndex(
      (elem) =>
        elem.level === kidsLevel &&
        elem.pozX >= xPozToArrange &&
        elem.pozX < xPozToArrange + gridStepX
    );

    if (indexAnyUnderArrange === -1) {
      // свободна
      return xPozToArrange;
    } else {
      // не свободна
      if (xCurPsn >= xMiddlePoint) {
        // сдвиг в текущем уровне
        for (let i = 0; i < arrAllPersons.length; i++) {
          if (
            arrAllPersons[i].level === kidsLevel &&
            arrAllPersons[i].pozX > xCurPsn
          ) {
            arrAllPersons[i].pozX = arrAllPersons[i].pozX + gridStepX;
          }
        }
      } else {
        // сдвиг уровней 1 - 3 целиком и от персоны включительно в текущем уровне
        for (let i = 0; i < arrAllPersons.length; i++) {
          if (
            arrAllPersons[i].level === kidsLevel &&
            arrAllPersons[i].pozX > xCurPsn
          ) {
            arrAllPersons[i].pozX = arrAllPersons[i].pozX + gridStepX;
          } else if (arrAllPersons[i].level <= 3) {
            arrAllPersons[i].pozX = arrAllPersons[i].pozX + gridStepX;
          }
        }
      }
    }
    //console.log("xPozToArrange = ", xPozToArrange);
    return xPozToArrange;
  };

  if (arrKids.length > 0) {
    for (let i = 0; i < arrKids.length; i++) {
      let xCurPerson = arrKids[i].pozX;
      let yCurPerson = arrKids[i].pozY;
      let levelCurPerson = arrKids[i].level;
      let psnGender = arrKids[i].gender;
      let psnLongname = arrKids[i].longname;
      let noSpouse = true;
      //console.log(psnLongname);
      //console.log(xCurPerson);
      // если мужчина, добавляю жену и бывших
      if (psnGender === "Man") {
        // сначала бывших
        let exwifes = [];
        let exwifesLongName = exspouses.filter(
          (elem) => elem.ex_husband === psnLongname
        );
        if (exwifesLongName.length > 0) {
          for (let i = 0; i < exwifesLongName.length; i++) {
            let j = arrAllRelPersons.findIndex(
              (elem) => elem.longname === exwifesLongName[i].ex_wife
            );
            if (j !== -1) {
              arrAllRelPersons[j].pozY = yCurPerson;
              arrAllRelPersons[j].level = levelCurPerson;
              exwifes.push(arrAllRelPersons[j]);
            }
          }
        }
        if (exwifes.length > 0) {
          noSpouse = false;

          for (let k = 0; k < exwifes.length; k++) {
            // вставить экс-жен влево от человека
            exwifes[k].pozX = leftArrange(
              xCurPerson,
              arrAllRelPersons,
              levelCurPerson,
              xMiddlePoint
            );
            arrPersons.push(exwifes[k]);
            //  добавить внуков
            arrPersons = putGrandChildren(
              arrKids[i],
              exwifes[k].longname,
              arrAllRelPersons,
              spouses,
              exspouses,
              levelCurPerson + 1,
              yCurPerson + gridStepY,
              arrPersons,
              xMiddlePoint
            );
          }
        }
        // жена
        let wife = [];
        let wifeLongnames = spouses.filter(
          (elem) => elem.husband === psnLongname
        );

        if (wifeLongnames.length > 0) {
          let j = arrAllRelPersons.findIndex(
            (elem) => elem.longname === wifeLongnames[0].wife
          );
          if (j !== -1) {
            arrAllRelPersons[j].level = levelCurPerson;
            arrAllRelPersons[j].pozY = yCurPerson;
            wife.push(arrAllRelPersons[j]);
          }
        }

        if (wife.length > 0) {
          noSpouse = false;
          // разместить супругу вправо от человека
          // вычислить текущее положение мужа
          let indexCurPerson = arrAllRelPersons.findIndex(
            (elem) => elem.longname === psnLongname
          );
          if (indexCurPerson > -1) {
            wife[0].pozX = rightArrange(
              arrAllRelPersons[indexCurPerson].pozX,
              arrAllRelPersons,
              levelCurPerson,
              xMiddlePoint
            );

            arrPersons.push(wife[0]);
            //  добавить внуков
            arrPersons = putGrandChildren(
              arrKids[i],
              wife[0].longname,
              arrAllRelPersons,
              spouses,
              exspouses,
              levelCurPerson + 1,
              yCurPerson + gridStepY,
              arrPersons,
              xMiddlePoint
            );
          }
        }

        if (noSpouse) {
          // добавить промежуток с последующим человеком
          arrPersons = putGrandChildren(
            arrKids[i],
            "noInfo",
            arrAllRelPersons,
            spouses,
            exspouses,
            levelCurPerson + 1,
            yCurPerson + gridStepY,
            arrPersons,
            xMiddlePoint
          );
        }
      } else {
        // если женщина, добавляю мужа и бывших
        let husband = [];
        noSpouse = true;
        // добавить мужа
        let husbandLongnames = spouses.filter(
          (elem) => elem.wife === psnLongname
        );
        if (husbandLongnames.length > 0) {
          //console.log("цикл по детям - дочь, вставить мужа");
          let j = arrAllRelPersons.findIndex(
            (elem) => elem.longname === husbandLongnames[0].husband
          );
          if (j !== -1) {
            arrAllRelPersons[j].level = levelCurPerson;
            arrAllRelPersons[j].pozY = yCurPerson;
            husband.push(arrAllRelPersons[j]);
          }
        }

        if (husband.length > 0) {
          noSpouse = false;
          let j1 = arrPersons.findIndex(
            (elem) => elem.longname === psnLongname
          );
          let xCurPsnNew = j1 > -1 ? arrPersons[j1].pozX : xCurPerson;
          // вставить влево от человека, если позиция свободна, или на место человека со сдвигом остальных
          husband[0].pozX = leftArrange(
            xCurPsnNew,
            arrAllRelPersons,
            levelCurPerson,
            xMiddlePoint
          );
          arrPersons.push(husband[0]);
          //  добавить внуков
          arrPersons = putGrandChildren(
            arrKids[i],
            husband[0].longname,
            arrAllRelPersons,
            spouses,
            exspouses,
            levelCurPerson + 1,
            yCurPerson + gridStepY,
            arrPersons,
            xMiddlePoint
          );
        }
        //  бывшие мужья, вставить справа
        //console.log("цикл по детям - дочь");
        let exhusbandLongnames:IExspouseType[] = [];
        exhusbandLongnames = exspouses.filter(
          (elem) => elem.ex_wife === psnLongname
        );
        let exhusbands = [];
        if (exhusbandLongnames.length > 0) {
          for (let i = 0; i < exhusbandLongnames.length; i++) {
            let j = arrAllRelPersons.findIndex(
              (elem) => elem.longname === exhusbandLongnames[i].ex_husband
            );
            if (j !== -1) {
              arrAllRelPersons[j].pozY = yCurPerson;
              arrAllRelPersons[j].level = levelCurPerson;
              exhusbands.push(arrAllRelPersons[j]);
            }
          }
        }

        if (exhusbands.length > 0) {
          noSpouse = false;
          let j1 = arrPersons.findIndex(
            (elem) => elem.longname === psnLongname
          );
          let xCurPsnNew = j1 > -1 ? arrPersons[j1].pozX : xCurPerson;

          for (let j = 0; j < exhusbands.length; j++) {
            exhusbands[j].pozX = rightArrange(
              xCurPsnNew,
              arrAllRelPersons,
              levelCurPerson,
              xMiddlePoint
            );

            arrPersons.push(exhusbands[j]);
            //console.log("ex_husband: ", exhusbands[j].longname);
            //console.log("ex_husband pozX: ", exhusbands[j].pozX);
          }

          for (let i = exhusbands.length - 1; i >= 0; i--) {
            if (i >= 0) {
              //  добавить внуков

              arrPersons = putGrandChildren(
                exhusbands[i],
                psnLongname,
                arrAllRelPersons,
                spouses,
                exspouses,
                levelCurPerson + 1,
                yCurPerson + gridStepY,
                arrPersons,
                xMiddlePoint
              );
            }
          }
        }

        if (noSpouse) {
          //
          arrPersons = putGrandChildren(
            arrKids[i],
            "noInfo",
            arrAllRelPersons,
            spouses,
            exspouses,
            levelCurPerson + 1,
            yCurPerson + gridStepY,
            arrPersons,
            xMiddlePoint
          );
        }
      }
    }
  }

  return arrPersons;
};
export default addSpouseAndEx;
