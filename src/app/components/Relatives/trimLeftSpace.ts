import minPozX from "./minPozX";
import { constRelTree } from "./constRelTree";
import { IPersonCard } from "../../models/psnCardType";

function trimLeftSpace(arrRelatives:IPersonCard[]) {
  // если слева осталось пустое место - сместиться влево
  const mgn = constRelTree.marginCard;

  let relArray:IPersonCard[] = [];
  relArray = relArray.concat(arrRelatives);

  const minX_inLevel = (arrCards:IPersonCard[], level: number) => {
    let arrPersonsLevel = arrCards.filter((elem) => elem.level === level);
    const minX = arrPersonsLevel.length > 0 ? minPozX(arrPersonsLevel) : null;
    return minX;
  };

  let leftEdg = [];
  let minX = mgn;

  for (let levelNum = 1; levelNum < 7; levelNum++) {
    let leftPozX = minX_inLevel(relArray, levelNum);

    if (leftPozX) {
      leftEdg.push(leftPozX);
    }
  }

  if (leftEdg.length > 0) {
    leftEdg.sort((a, b) => a - b);
    minX = leftEdg[0];
  }

  const shiftX = minX - mgn;
  
  relArray.forEach((elem) => {
    elem.pozX = elem.pozX - shiftX;
  });

  return relArray;
}
export default trimLeftSpace;
