import { constRelTree } from "@/app/components/Relatives/constRelTree";
import { IPersonCard } from '../../models/psnCardType'

const personKidPlaceLeft = (
  parent: IPersonCard,
  parent2: IPersonCard | null,
  objKid: IPersonCard,
  arrPersons: IPersonCard[]) => {
  
  if (!objKid) {
    return arrPersons;
  }
  const mgn = constRelTree.marginCard;
  const gridstepX = constRelTree.miniWidth + mgn;
  const gridstepY = constRelTree.miniHeight + constRelTree.marginY;
  const pozXparent = parent.pozX;
  const pozYparent = parent.pozY;
  const parentLevel = parent.level;
  const kidLevel = parentLevel + 1;

  if (!arrPersons) {
    return arrPersons;
  }
  // позиция под родителем
  let keyPozX = 0;
  let keyPerson = null;
  if (!parent2) {
    keyPozX = pozXparent;
    keyPerson = parent;
  } else {
    keyPozX = pozXparent > parent2.pozX ? parent2.pozX : pozXparent;
    keyPerson = pozXparent > parent2.pozX ? parent2 : parent;
  }

  let pozXmostLeftPerson = keyPerson.pozX;
  // свободна ли позиция?
  // есть ли кто-то в этой позиции в уровне размещения и в уровнях ниже?
  let isKeyPozXFree = true;
  isKeyPozXFree =
    arrPersons.filter((elem) => elem.level >= kidLevel && elem.pozX <= keyPozX)
      .length > 0
      ? false
      : true;

  if (!isKeyPozXFree) {
    // если позиция занята, разместить левее самой левой карточки
    let arrPersonPlaced = arrPersons.filter(
      (elem) => elem.level !== 0 && elem.level > parentLevel
    );

    if (arrPersonPlaced.length > 0) {
      arrPersonPlaced.sort((a, b) => a.pozX - b.pozX);
      pozXmostLeftPerson = arrPersonPlaced[0].pozX;
    }
    keyPozX = pozXmostLeftPerson - gridstepX;
  }
  // если вышли за левую границу экрана, сдвигаем всех вправо на шаг
  if (keyPozX < 0) {
    arrPersons.forEach((elem) => {
      elem.pozX = elem.level !== 0 ? elem.pozX + gridstepX : elem.pozX;
    });
    keyPozX = keyPozX + gridstepX;
  }
  // найти в массиве размещаемого человека
  const kidLongname = objKid.longname;
  const indexKidInArr = arrPersons.findIndex(
    (elem) => elem.longname === kidLongname
  );

  if (indexKidInArr > -1) {
    arrPersons[indexKidInArr].level = kidLevel;
    arrPersons[indexKidInArr].pozY = pozYparent + gridstepY;
    arrPersons[indexKidInArr].pozX = keyPozX;
  }
  return arrPersons;
};
export default personKidPlaceLeft;
