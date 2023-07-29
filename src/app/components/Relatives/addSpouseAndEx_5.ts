import { constRelTree } from "./constRelTree";
import putGrandGrandChildren from "./putGrandGrandChildren";
import { IPersonCard } from "../../models/psnCardType";
import { ISpouseType } from "../../models/spousesType";
import { IExspouseType } from "../../models/exsposesType";

const addSpouseAndEx_5 = (
  arrKids5: IPersonCard[],
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
  let arrPsnUpdated: IPersonCard[] = [];

  const leftArrange = (
    xCurPsn: number,
    isFirstKid: boolean,
    xParentLeft: number,
    arrAllPersons: IPersonCard[],
    kidsLevel: number,
    xMiddlePoint: number
  ) => {
    let xLeftEdg = Math.max(xCurPsn - 2 * gridStepX, 0);
    let xPozToArrange = xCurPsn - gridStepX;
    let newXCurPsn = xCurPsn;
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
          // сдвиг всех от персоны в уровне 5
          for (let i = 0; i < arrAllPersons.length; i++) {
            if (
              arrAllPersons[i].pozX >= xCurPsn &&
              arrAllPersons[i].level === 5
            ) {
              arrAllPersons[i].pozX = arrAllPersons[i].pozX + gridStepX;
            }
          }
          newXCurPsn = xCurPsn + gridStepX;
        } else {
          // сдвиг всех от персоны в уровне 5
          // и сдвиг уровней меньше и равно 3
          for (let i = 0; i < arrAllPersons.length; i++) {
            if (
              (arrAllPersons[i].pozX >= xCurPsn &&
                arrAllPersons[i].level === 5) ||
              arrAllPersons[i].level < 4
            ) {
              arrAllPersons[i].pozX = arrAllPersons[i].pozX + gridStepX;
            }
          }
          newXCurPsn = xCurPsn + gridStepX;
        }

        if (isFirstKid && newXCurPsn > xParentLeft) {
          // сдвинуть 4й уровень от левого родителя
          let shift = newXCurPsn - xParentLeft;
          for (let i = 0; i < arrAllPersons.length; i++) {
            if (
              arrAllPersons[i].pozX >= xParentLeft &&
              arrAllPersons[i].level === 4
            ) {
              arrAllPersons[i].pozX += shift;
            }
          }
        }
        xPozToArrange = xCurPsn;
      }
    }

    return xPozToArrange;
  };

  const rightArrange = (xCurPsn: number, arrAllPersons: IPersonCard[],
    kidsLevel: number, xMiddlePoint: number) => {
    let xPozToArrange = xCurPsn + gridStepX;

    // определить свободную позицию снизу
    //let arrLowLevels = arrAllPersons.filter((elem) => elem.level > kidsLevel);
    /* let xFreePozLowLevels = 0;
    if (arrLowLevels.length > 0) {
      for (let i = 0; i < arrLowLevels.length; i++) {
        xFreePozLowLevels = Math.max(xFreePozLowLevels, arrLowLevels[i].pozX);
      }
    } */
    // свободная позиция снизу больше позиции размещения, сдвинуть уровень от персоны на разницу
    //let xShift = xFreePozLowLevels - xCurPsn;
    //console.log("xShift = ", xShift);
    /* if (xShift > 0) {
      for (let i = 0; i < arrAllPersons.length; i++) {
        if (
          arrAllPersons[i].level === kidsLevel &&
          arrAllPersons[i].pozX > xCurPsn
        ) {
          arrAllPersons[i].pozX = arrAllPersons[i].pozX + xShift;
        }
      }
    }
 */
    // место свободно?
    let indexAnyUnderArrange = arrAllPersons.findIndex(
      (elem) =>
        elem.level >= kidsLevel &&
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
        // сдвиг уровней 1 - 4 целиком и от персоны включительно в текущем уровне

        for (let i = 0; i < arrAllPersons.length; i++) {
          if (
            (arrAllPersons[i].level === kidsLevel &&
              arrAllPersons[i].pozX > xCurPsn) ||
            arrAllPersons[i].level <= 4
          ) {
            arrAllPersons[i].pozX = arrAllPersons[i].pozX + gridStepX;
          }
        }
      }
    }

    return xPozToArrange;
  };

  if (arrKids5.length === 0) {
    arrPsnUpdated = arrPsnUpdated.concat(arrPersons);
    return arrPsnUpdated;
  }
  let isFirstKid = false;
  for (let k = 0; k < arrKids5.length; k++) {
    let xCurPerson = arrKids5[k].pozX;
    let yCurPerson = arrKids5[k].pozY;
    let levelCurPerson = arrKids5[k].level;
    let psnGender = arrKids5[k].gender;
    let psnLongname = arrKids5[k].longname;
    let noSpouse = true;
    if (k === 0) {
      isFirstKid = true;
    } else {
      isFirstKid = false;
    }
    //console.log("персона 5 ур. ", psnLongname);
    // определить местоположение родителей
    let dadLongname = arrKids5[k].dad;
    let momLongname = arrKids5[k].mother;
    let indexDad = arrAllRelPersons.findIndex(
      (elem) => elem.longname === dadLongname
    );
    let indexMom = arrAllRelPersons.findIndex(
      (elem) => elem.longname === momLongname
    );

    let xParentLeft = 0;
    //let xParentRight = 0;
    if (indexDad > -1 && indexMom > -1) {
      xParentLeft = Math.min(
        arrAllRelPersons[indexDad].pozX,
        arrAllRelPersons[indexMom].pozX
      );
      //xParentRight = Math.max(arrAllRelPersons[indexDad].pozX, arrAllRelPersons[indexMom].pozX) + constRelTree.miniWidth;
    } else if (indexDad > -1 && indexMom === -1) {
      xParentLeft = arrAllRelPersons[indexDad].pozX;
      //xParentRight = xParentLeft + constRelTree.miniWidth;
    } else if (indexDad === -1 && indexMom > -1) {
      xParentLeft = arrAllRelPersons[indexMom].pozX;
      //xParentRight = xParentLeft + constRelTree.miniWidth;
    }
    if (psnGender === "Man") {
      // если мужчина, добавляю жену и бывших
      // сначала бывших
      let exwifes = [];
      let exwifesLongName = exspouses.filter(
        (elem) => elem.ex_husband === psnLongname
      );

      if (exwifesLongName.length > 0) {
        for (let i = 0; i < exwifesLongName.length; i++) {
          let indexExWife = arrAllRelPersons.findIndex(
            (elem) => elem.longname === exwifesLongName[i].ex_wife
          );

          if (indexExWife !== -1) {
            arrAllRelPersons[indexExWife].pozY = yCurPerson;
            arrAllRelPersons[indexExWife].level = levelCurPerson;
            exwifes.push(arrAllRelPersons[indexExWife]);
          }
        }
      }

      if (exwifes.length > 0) {
        noSpouse = false;

        for (let k1 = 0; k1 < exwifes.length; k1++) {
          // вставить экс-жен влево от человека
          //console.log("экс-жена: ", exwifes[k1].longname);
          exwifes[k1].pozX = leftArrange(
            xCurPerson,
            isFirstKid,
            xParentLeft,
            arrAllRelPersons,
            levelCurPerson,
            xMiddlePoint
          );
          //console.log("exwife =", exwifes[k1].longname, exwifes[k1].pozX);
          arrPersons.push(exwifes[k1]);
        }
        //  добавить правнуков
        for (let k1 = exwifes.length - 1; k1 >= 0; k1--) {
          arrPersons = putGrandGrandChildren(
            arrKids5[k],
            exwifes[k1].longname,
            arrAllRelPersons,
            spouses,
            exspouses,
            6,
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
        let indexWife = arrAllRelPersons.findIndex(
          (elem) => elem.longname === wifeLongnames[0].wife
        );
        if (indexWife > -1) {
          arrAllRelPersons[indexWife].level = levelCurPerson;
          arrAllRelPersons[indexWife].pozY = yCurPerson;
          wife.push(arrAllRelPersons[indexWife]);
        }
      }

      if (wife.length > 0) {
        noSpouse = false;
        // разместить супругу вправо от человека
        //console.log("жена: ", wife[0].longname);
        // вычислить текущее положение мужа
        let indexCurPerson = arrAllRelPersons.findIndex(
          (elem) => elem.longname === psnLongname
        );
        if (indexCurPerson > -1) {
          wife[0].pozX = rightArrange(
            arrAllRelPersons[indexCurPerson].pozX,
            arrPersons,
            levelCurPerson,
            0
          );
          //console.log(" pozX жены: ", wife[0].pozX);
          arrPersons.push(wife[0]);
          //  добавить правнуков
          arrPersons = putGrandGrandChildren(
            arrKids5[k],
            wife[0].longname,
            arrAllRelPersons,
            spouses,
            exspouses,
            6,
            yCurPerson + gridStepY,
            arrPersons,
            xMiddlePoint
          );
        }
      }
      if (noSpouse) {
        // нет информации о женах
        // возможна инфо о правнуках
        arrPersons = putGrandGrandChildren(
          arrKids5[k],
          "noInfo",
          arrAllRelPersons,
          spouses,
          exspouses,
          6,
          yCurPerson + gridStepY,
          arrPersons,
          xMiddlePoint
        );
      }
    } else {
      //  если женщина, добавляю мужа и бывших
      // добавить мужа
      let husband = [];
      noSpouse = true;

      let husbandLongnames = spouses.filter(
        (elem) => elem.wife === psnLongname
      );
      if (husbandLongnames.length > 0) {
        let j = arrAllRelPersons.findIndex(
          (elem) => elem.longname === husbandLongnames[0].husband
        );
        if (j > -1) {
          arrAllRelPersons[j].level = levelCurPerson;
          arrAllRelPersons[j].pozY = yCurPerson;
          husband.push(arrAllRelPersons[j]);
        }
      }
      if (husband.length > 0) {
        noSpouse = false;
        // вставить влево от человека, если позиция свободна, или на место человека со сдвигом остальных
        husband[0].pozX = leftArrange(
          xCurPerson,
          isFirstKid,
          xParentLeft,
          arrAllRelPersons,
          levelCurPerson,
          xMiddlePoint
        );
        arrPersons.push(husband[0]);
        //  добавить правнуков
        arrPersons = putGrandGrandChildren(
          arrKids5[k],
          husband[0].longname,
          arrAllRelPersons,
          spouses,
          exspouses,
          6,
          yCurPerson + gridStepY,
          arrPersons,
          xMiddlePoint
        );
      }
      //  бывшие мужья, вставить справа
      let exhusbandLongnames: IExspouseType[] = [];
      exhusbandLongnames = exspouses.filter(
        (elem) => elem.ex_wife === psnLongname
      );

      let exhusbands = [];
      if (exhusbandLongnames.length > 0) {
        for (let i = 0; i < exhusbandLongnames.length; i++) {
          let j = arrAllRelPersons.findIndex(
            (elem) => elem.longname === exhusbandLongnames[i].ex_husband
          );
          if (j > -1) {
            arrAllRelPersons[j].pozY = yCurPerson;
            arrAllRelPersons[j].level = levelCurPerson;
            exhusbands.push(arrAllRelPersons[j]);
          }
        }
      }

      if (exhusbands.length > 0) {
        noSpouse = false;
        let j1 = arrPersons.findIndex((elem) => elem.longname === psnLongname);
        let xCurPsnNew = j1 > -1 ? arrPersons[j1].pozX : xCurPerson;

        for (let j = 0; j < exhusbands.length; j++) {
          exhusbands[j].pozX = rightArrange(
            xCurPsnNew,
            arrPersons,
            levelCurPerson,
            0
          );

          arrPersons.push(exhusbands[j]);
        }
        //  добавить правнуков
        for (let j = exhusbands.length - 1; j >= 0; j--) {
          //console.log(exhusbands[j].longname);
          arrPersons = putGrandGrandChildren(
            arrKids5[k],
            exhusbands[j].longname,
            arrAllRelPersons,
            spouses,
            exspouses,
            6,
            yCurPerson + gridStepY,
            arrPersons,
            xMiddlePoint
          );
        }
      }
      if (noSpouse) {
        // нет инфо о мужьях
        // возможна инфо о правнуках
        arrPersons = putGrandGrandChildren(
          arrKids5[k],
          "noInfo",
          arrAllRelPersons,
          spouses,
          exspouses,
          6,
          yCurPerson + gridStepY,
          arrPersons,
          xMiddlePoint
        );
      }
    }
  }

  return arrPersons;
};
export default addSpouseAndEx_5;
