import areMarried from "./areMarried";
import { constRelTree } from "../Relatives/constRelTree";
import { IPersonCard } from '../../models/psnCardType'
import { ISpouseType } from '../../models/spousesType'

const personKidPlace = (
  parent:IPersonCard | null,
  parent2:IPersonCard | null,
  objKid:IPersonCard,
  kidsAmount: number,
  arrPersons:IPersonCard[],
  spouses:ISpouseType[]
) => {
  if (!kidsAmount || !parent) {
    return arrPersons;
  }
  const mgn = constRelTree.marginCard;
  const gridstepX = constRelTree.miniWidth + mgn;
  const gridstepY = constRelTree.miniHeight + constRelTree.marginY;
  const pozXparent = parent.pozX;
  const pozYparent = parent.pozY;
  const kidLevel = parent.level + 1;
  let married = false;
  let pozXlevelFree = 0;

  // определить свободную позицию в уровне, где размещаем детей
  let arrPersonPlaced = arrPersons.filter(
    (elem) => elem.level !== 0 && elem.level > kidLevel - 1
  );
  if (arrPersonPlaced.length > 0) {
    
    for (let i = 0; i < arrPersonPlaced.length; i++) {
      if (arrPersonPlaced[i].pozX >= pozXlevelFree) {
        pozXlevelFree = arrPersonPlaced[i].pozX + gridstepX;
      }
    }
  }
  let kidLongname = objKid.longname;
  let k = arrPersons.findIndex((elem) => elem.longname === kidLongname);
  if (k > -1) {
    arrPersons[k].level = kidLevel;
    arrPersons[k].pozY = pozYparent + gridstepY;
  } else {
    return arrPersons;
  }

  if (parent2) {
    if (parent.gender === "Man") {
      married = areMarried(spouses, parent.longname, parent2.longname);
    } else {
      married = areMarried(spouses, parent2.longname, parent.longname);
    }
    objKid.level = kidLevel;
    objKid.pozY = pozYparent + gridstepY;
  } else {
    // сведений о супруге нет
    let pozXcur = Math.max(pozXlevelFree, pozXparent);

    arrPersons[k].pozX = pozXcur;

    return arrPersons;
  }
  //
  let parentGender = parent.gender;
  switch (parentGender) {
    case "Man":
      switch (married) {
        case true:
          // размещение детей женатого мужчины
          if (kidsAmount === 1) {
            pozXlevelFree = Math.max(pozXlevelFree, pozXparent);
            arrPersons[k].pozX = pozXlevelFree + gridstepX / 2;
          } else if (kidsAmount === 2) {
            if (pozXparent - gridstepX > pozXlevelFree) {
              arrPersons[k].pozX = pozXparent;
            } else {
              arrPersons[k].pozX = pozXlevelFree;
            }
          } else {
            if (pozXparent - 2 * gridstepX > pozXlevelFree) {
              arrPersons[k].pozX = pozXparent - gridstepX;
            } else {
              arrPersons[k].pozX = pozXlevelFree;
            }
          }
          break;
        case false:
          //  размещение детей разведенного мужчины
          if (kidsAmount === 1) {
            pozXlevelFree = Math.max(pozXlevelFree, pozXparent);
            arrPersons[k].pozX =
              pozXlevelFree > pozXparent - gridstepX / 2
                ? pozXlevelFree
                : pozXparent - gridstepX / 2;
          } else {
            // проверить, есть ли место под бывшей супругой
            if (pozXlevelFree >= parent2.pozX) {
              //console.log(' место  под экс женой занято ')
              arrPersons[k].pozX = pozXlevelFree;
            } else {
              //console.log(' место свободно ')
              arrPersons[k].pozX = parent2.pozX;
            }
          }
          break;
        default:
          break;
      }
      break;
    case "Woman":
      switch (married) {
        case true:
          // размещение детей замужней женщины
          if (kidsAmount === 1) {
            pozXlevelFree = Math.max(pozXlevelFree, pozXparent - gridstepX);
            arrPersons[k].pozX = pozXlevelFree + gridstepX / 2;
          } else if (kidsAmount === 2) {
            if (pozXparent - gridstepX > pozXlevelFree) {
              arrPersons[k].pozX = pozXparent - gridstepX;
            } else {
              arrPersons[k].pozX = pozXlevelFree;
            }
          } else {
            if (pozXparent - 2 * gridstepX > pozXlevelFree) {
              arrPersons[k].pozX = pozXparent - gridstepX * 2;
            } else if (parent2.pozX - gridstepX > pozXlevelFree) {
              arrPersons[k].pozX = pozXlevelFree - gridstepX;
            } else {
              arrPersons[k].pozX = pozXlevelFree;
            }
          }
          break;
        case false:
          //  размещение детей разведенной женщины
          pozXlevelFree = Math.max(pozXlevelFree, pozXparent);
          if (kidsAmount === 1) {
            arrPersons[k].pozX = pozXlevelFree + gridstepX / 2;
          } else {
            arrPersons[k].pozX = pozXlevelFree
          }

          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
  return arrPersons;
};
export default personKidPlace;
