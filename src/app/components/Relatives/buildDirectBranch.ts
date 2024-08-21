import { constRelTree } from "./constRelTree";
import parentsPlace from "../Familytree/parentsPlace";
import putChildren from "./putChildren";
import { IPersonCard } from "../../models/psnCardType";
import { ISpouseType } from "../../models/spousesType";
import { IExspouseType } from "../../models/exsposesType";

function buildDirectBranch(curPerson: string,
  arrAllRelPersons: IPersonCard[], spouses: ISpouseType[], exspouses: IExspouseType[]):IPersonCard[] {
  let mainPersons = [];
  let relArray: IPersonCard[] = [];
  let keyPersonGender = "";
  let isMan = true;
  let person4Tree: IPersonCard = {
    longname: '',
    level: 0,
    pozX: 0,
    pozY: 0,
    minicard: '',
    gender: 'Man',
    lineColor: constRelTree.lineColor,
    dad: '',
    mother: ''  
}
  let spouse4Tree: IPersonCard  = {
    longname: '',
    level: 0,
    pozX: 0,
    pozY: 0,
    minicard: '',
    gender: 'Man',
    lineColor: constRelTree.lineColor,
    dad: '',
    mother: ''  
}
  let parents = [];
  let parentsInLaw = [];

  const mgn = constRelTree.marginCard;
  const gridStepX = mgn + constRelTree.miniWidth;
  const gridStepY = constRelTree.marginY + constRelTree.miniHeight;

  let x0 = gridStepX * 4 + mgn; //constRelTree.startPointX;  мужская позция, относительно кот. строим дерево 530px
  let y0 =
    constRelTree.marginY + (constRelTree.miniHeight + constRelTree.marginY) * 2;

  if (!curPerson) {
    return relArray;
  }

  const arrangeExSpouses = (isMan: boolean, exspouses: IPersonCard[], relArray:IPersonCard[]) => {
    let relArrayNew: IPersonCard[] = [];
    relArrayNew = relArrayNew.concat(relArray);
    if (exspouses.length > 0) {
      let n = exspouses.length;
      if (isMan) {
        // отодвигаю точку отсчета
        if (n > 3) {
          x0 = x0 + (n - 3) * gridStepX;
          // общий сдвиг вправо на выход за рамку
          for (let i = 0; i < relArrayNew.length; i++) {
            relArrayNew[i].pozX = relArrayNew[i].pozX + (n - 3) * gridStepX;
          }
        }
      }

      for (let i = 0; i < n; i++) {
        let x = isMan ? x0 - gridStepX * (i + 1) : x0 + gridStepX * (i + 2);
        let newPersonObj = exspouses[i];
        newPersonObj.pozX = x;
        relArrayNew.push(newPersonObj);
      }
    }

    return relArrayNew;
  };

  // ключевая персона
  mainPersons = arrAllRelPersons.filter((elem) => elem.longname === curPerson);

  // ключевая песона - назначить позицию на экране
  // Уровень 3
  let indexKeyPsn = arrAllRelPersons.findIndex(
    (elem) => elem.longname === curPerson
  );
  if (indexKeyPsn > -1) {
    arrAllRelPersons[indexKeyPsn].pozY = y0;
    arrAllRelPersons[indexKeyPsn].level = 3;
    keyPersonGender = arrAllRelPersons[indexKeyPsn].gender;
    isMan = keyPersonGender === "Man" ? true : false;
    arrAllRelPersons[indexKeyPsn].pozX = isMan ? x0 : x0 + gridStepX;
    person4Tree = arrAllRelPersons[indexKeyPsn];
    relArray.push(person4Tree);
  }

  let spouseLongname = "";
  let indexInSpouses = -1;
  indexInSpouses =
    keyPersonGender === "Man"
      ? spouses.findIndex((elem) => elem.husband === curPerson)
      : spouses.findIndex((elem) => elem.wife === curPerson);
  if (indexInSpouses > -1) {
    spouseLongname =
      keyPersonGender === "Man"
        ? spouses[indexInSpouses].wife
        : spouses[indexInSpouses].husband;
    let indexInRelatives = arrAllRelPersons.findIndex(
      (elem) => elem.longname === spouseLongname
    );
    let xMainPerson = mainPersons[0].pozX;
    let pozX =
      keyPersonGender === "Man"
        ? xMainPerson + gridStepX
        : xMainPerson - gridStepX;
    if (indexInRelatives > -1) {
      arrAllRelPersons[indexInRelatives].pozX = pozX;
      arrAllRelPersons[indexInRelatives].pozY = y0;
      arrAllRelPersons[indexInRelatives].level = 3;
      spouse4Tree = arrAllRelPersons[indexInRelatives];
      relArray.push(spouse4Tree);
    }
  }

  // мужской алгоритм: бывшие жены (если больше 3х - сдвиг х0 на превышение), жена, её бывшие мужья
  // женский алгоритм: муж, его бывшие жены, бывшие мужья

  if (isMan) {
    let arrTempExWifes = exspouses.filter(
      (elem) => elem.ex_husband === curPerson
    );
    let exWifes = [];
    let xMainPerson = mainPersons[0].pozX;
    if (arrTempExWifes.length > 0) {
      for (let i = 0; i < arrTempExWifes.length; i++) {
        let ex_wife = arrTempExWifes[i].ex_wife;
        let indexExWife = arrAllRelPersons.findIndex(
          (elem) => elem.longname === ex_wife
        );
        if (indexExWife > -1) {
          arrAllRelPersons[indexExWife].pozX =
            xMainPerson - gridStepX * (i + 1) - mgn;
          arrAllRelPersons[indexExWife].pozY = y0;
          arrAllRelPersons[indexExWife].level = 3;
          exWifes.push(arrAllRelPersons[indexExWife]);
        }
      }

      relArray = arrangeExSpouses(true, exWifes, relArray);
    }
  } else {
    let exHusbands = [];
    let xMainPerson = mainPersons[0].pozX;
    let arrTempExHusbands = exspouses.filter(
      (elem) => elem.ex_wife === curPerson
    );

    if (arrTempExHusbands.length > 0) {
      for (let i = 0; i < arrTempExHusbands.length; i++) {
        let ex_husbandLongname = arrTempExHusbands[i].ex_husband;
        let indexExHusband = arrAllRelPersons.findIndex(
          (elem) => elem.longname === ex_husbandLongname
        );
        if (indexExHusband > -1) {
          arrAllRelPersons[indexExHusband].pozX =
            xMainPerson + gridStepX * (i + 1) + mgn;
          arrAllRelPersons[indexExHusband].pozY = y0;
          arrAllRelPersons[indexExHusband].level = 3;
          exHusbands.push(arrAllRelPersons[indexExHusband]);
        }
      }

      relArray = arrangeExSpouses(false, exHusbands, relArray);
    }
  }

  // родители. уровень 2
  let longnameDad = mainPersons[0].dad;
  let longnameMom = mainPersons[0].mother;
  let xMainPerson = mainPersons[0].pozX;
  let coordParent = parentsPlace(
    keyPersonGender,
    longnameDad,
    longnameMom,
    xMainPerson,
    gridStepX,
    mgn,
    spouses
  );

  let x_dad = coordParent.x_dad;
  let x_mom = coordParent.x_mom;
  // присвоение аттрибутов родителям
  if (longnameDad) {
    let j = arrAllRelPersons.findIndex((elem) => elem.longname === longnameDad);
    if (j > -1) {
      arrAllRelPersons[j].pozX = x_dad;
      arrAllRelPersons[j].pozY = y0 - gridStepY;
      arrAllRelPersons[j].level = 2;
      parents.push(arrAllRelPersons[j]);
    }
  }
  if (longnameMom) {
    let j = arrAllRelPersons.findIndex((elem) => elem.longname === longnameMom);
    if (j > -1) {
      arrAllRelPersons[j].pozX = x_mom;
      arrAllRelPersons[j].pozY = y0 - gridStepY;
      arrAllRelPersons[j].level = 2;
      parents.push(arrAllRelPersons[j]);
    }
  }

  relArray = relArray.concat(parents);

  //тесть и теща или  свекр и свекровь. уровень 2
  if (spouse4Tree) {
    longnameDad = spouse4Tree.dad;
    longnameMom = spouse4Tree.mother;
    let spouseGender = spouse4Tree.gender;
    let xSpouse = spouse4Tree.pozX;

    coordParent = parentsPlace(
      spouseGender,
      longnameDad,
      longnameMom,
      xSpouse,
      gridStepX,
      mgn,
      spouses
    );
    x_dad = coordParent.x_dad;
    x_mom = coordParent.x_mom;

    if (longnameDad) {
      let j = arrAllRelPersons.findIndex(
        (elem) => elem.longname === longnameDad
      );
      if (j > -1) {
        arrAllRelPersons[j].pozX = x_dad;
        arrAllRelPersons[j].pozY = y0 - gridStepY;
        arrAllRelPersons[j].level = 2;
        parentsInLaw.push(arrAllRelPersons[j]);
      }
    }
    if (longnameMom) {
      let j = arrAllRelPersons.findIndex(
        (elem) => elem.longname === longnameMom
      );
      if (j > -1) {
        arrAllRelPersons[j].pozX = x_mom;
        arrAllRelPersons[j].pozY = y0 - gridStepY;
        arrAllRelPersons[j].level = 2;
        parentsInLaw.push(arrAllRelPersons[j]);
      }
    }
  }

  relArray = relArray.concat(parentsInLaw);


  // уровень "дедушки и бабушки". уровень 1
  let arrPersonsLevel1 = [];

  let arrPersonsLevel2 = relArray.filter((elem) => elem.level === 2);
  if (arrPersonsLevel2.length > 0) {
    arrPersonsLevel2.sort((a, b) => a.pozX - b.pozX);
    for (let i = 0; i < arrPersonsLevel2.length; i++) {
      let dadLongname = arrPersonsLevel2[i].dad;
      let momLongname = arrPersonsLevel2[i].mother;
      let personPozX = arrPersonsLevel2[i].pozX;
      let personGender = arrPersonsLevel2[i].gender;
      let k = 0;
      if (i === 0) {
        k = -1;
      } else if (i === 1) {
        k = -1;
      } else if (i === 2) {
        k = 1;
      } else if (i === 3) {
        k = 1;
      }
      personPozX = personPozX + k * gridStepX;

      coordParent = parentsPlace(
        personGender,
        dadLongname,
        momLongname,
        personPozX,
        gridStepX,
        mgn,
        spouses
      );
      let x_dad = coordParent.x_dad;
      let x_mom = coordParent.x_mom;

      // проверить, что нет наложения
      let maxPozXlevel1 = mgn;
      let arrTemp = arrAllRelPersons.filter((elem) => elem.level === 1);
      if (arrTemp.length > 0) {
        for (let i = 0; i < arrTemp.length; i++) {
          maxPozXlevel1 =
            arrTemp[i].pozX > maxPozXlevel1 ? arrTemp[i].pozX : maxPozXlevel1;
        }
      }

      let minXdad_mom = Math.min(x_dad, x_mom);

      if (maxPozXlevel1 + gridStepX - minXdad_mom >= 0) {
        x_dad = x_dad + (maxPozXlevel1 + gridStepX - minXdad_mom);
        x_mom = x_mom + (maxPozXlevel1 + gridStepX - minXdad_mom);
      }

      // присвоение аттрибутов персонам уровня 1
      if (dadLongname) {
        let j = arrAllRelPersons.findIndex(
          (elem) => elem.longname === dadLongname
        );
        if (j > -1) {
          arrAllRelPersons[j].pozX = x_dad;
          arrAllRelPersons[j].pozY = y0 - 2 * gridStepY;
          arrAllRelPersons[j].level = 1;
          arrPersonsLevel1.push(arrAllRelPersons[j]);
        }
      }
      if (momLongname) {
        let j = arrAllRelPersons.findIndex(
          (elem) => elem.longname === momLongname
        );
        if (j > -1) {
          arrAllRelPersons[j].pozX = x_mom;
          arrAllRelPersons[j].pozY = y0 - 2 * gridStepY;
          arrAllRelPersons[j].level = 1;
          arrPersonsLevel1.push(arrAllRelPersons[j]);
        }
      }
    }
    relArray = relArray.concat(arrPersonsLevel1);
  }

  
  //Дети - 4-ый уровень

  relArray = putChildren(
    person4Tree,
    arrAllRelPersons,
    spouses,
    exspouses,
    4,
    y0 + gridStepY,
    relArray,
    person4Tree.pozX
  );

  // разъединить мужчина-женщина не состоящих в браке
  for (let t = 0; t < 2; t++) {
    let arrPersonsLevel5 = relArray.filter((elem) => elem.level === 5 - t);
    if (arrPersonsLevel5.length > 0) {
      for (let i = 0; i < arrPersonsLevel5.length; i++) {
        let xMan = 0;
        let xWoman = 0;
        let manLongname = "";
        let womanLongname = "";
        if (arrPersonsLevel5[i].gender === "Man") {
          xMan = arrPersonsLevel5[i].pozX;
          manLongname = arrPersonsLevel5[i].longname;
          let j = arrPersonsLevel5.findIndex(
            (elem) => elem.pozX === xMan + gridStepX
          );
          if (j > -1) {
            if (arrPersonsLevel5[j].gender === "Woman") {
              // проверить состоят ли в браке
              womanLongname = arrPersonsLevel5[j].longname;
              let j1 = spouses.findIndex(
                (elem) =>
                  elem.husband === manLongname && elem.wife === womanLongname
              );
              if (j1 === -1) {
                xWoman = arrPersonsLevel5[j].pozX;
                let herLevel = 5 - t;
                for (let k = 0; k < relArray.length; k++) {
                  if (
                    relArray[k].level >= herLevel &&
                    relArray[k].pozX >= xWoman
                  ) {
                    relArray[k].pozX = relArray[k].pozX + mgn;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // если левый человек в 4-ом уровне справа от левого человека в 3-м уровне,
  // сдвинуть уровни 1 - 3 вправо на разницу
  let arrPersonsLevel4 = relArray.filter((elem) => elem.level === 4);
  if (arrPersonsLevel4.length > 0) {
    arrPersonsLevel4.sort((a, b) => a.pozX - b.pozX);
    let xleftPsn4 = arrPersonsLevel4[0].pozX;
    let arrPsnLevel3 = relArray.filter((elem) => elem.level === 3);
    arrPsnLevel3.sort((a, b) => a.pozX - b.pozX);
    let xleftPsn3 = arrPsnLevel3[0].pozX;
    let shift = xleftPsn4 - xleftPsn3;
    if (shift > 0) {
      for (let k = 0; k < relArray.length; k++) {
        if (relArray[k].level <= 3) {
          relArray[k].pozX = relArray[k].pozX + shift;
        }
      }
    }
  }

  return relArray;
}
export default buildDirectBranch;
