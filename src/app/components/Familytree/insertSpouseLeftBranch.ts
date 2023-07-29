import { constRelTree } from '@/app/components/Relatives/constRelTree';
import { IPersonCard } from "../../models/psnCardType";

function insertSpouseLeftBranch(objPerson:IPersonCard, objSpouse:IPersonCard, arrAllPsns:IPersonCard[]) {
  if (!objPerson || !objSpouse) {
    return arrAllPsns;
  }

  const gridstepX = constRelTree.miniWidth + constRelTree.marginCard;
  const personGender = objPerson.gender;
  const psnLevel = objPerson.level;
  const psnPozX = objPerson.pozX;
  const psnPozY = objPerson.pozY;
  const spouseLongName = objSpouse.longname;

  const indexPsnByLongname = (psnLongName:string, arrAll:IPersonCard[]) => {
    let indexPsnInArr = arrAll.findIndex(
      (elem) => elem.longname === psnLongName
    );
    return indexPsnInArr;
  };
  const setPsnAttributes = (objPsn:IPersonCard, pozX:number, pozY:number, level:number) => {
    objPsn.pozX = pozX;
    objPsn.pozY = pozY;
    objPsn.level = level;
    return objPsn;
  };

  if (personGender === "Woman") {
    // разместить мужа слева от нее
    // если слева никого нет и позиция размещения не отрицательная
    let somebodyOnLeft = arrAllPsns.filter((elem) => elem.pozX < psnPozX);
    let spousePozX = psnPozX - gridstepX;
    if (somebodyOnLeft.length === 0 && spousePozX > 0) {
      let indexSpouseInArr = indexPsnByLongname(spouseLongName, arrAllPsns);
      if (indexSpouseInArr > -1) {
        let newObjSpouse = setPsnAttributes(
          arrAllPsns[indexSpouseInArr],
          spousePozX,
          psnPozY,
          psnLevel
        );
        arrAllPsns.splice(indexSpouseInArr, 1, newObjSpouse);
      }
    } else if (spousePozX < 0) {
      // сдвинуть картину на шаг сетки
      arrAllPsns.forEach((element) => {
        if (element.level > 0) {
          element.pozX += gridstepX;
        }
      });
      let indexSpouseInArr = indexPsnByLongname(spouseLongName, arrAllPsns);
      if (indexSpouseInArr > -1) {
        let newObjSpouse = setPsnAttributes(
          arrAllPsns[indexSpouseInArr],
          psnPozX,
          psnPozY,
          psnLevel
        );
        arrAllPsns.splice(indexSpouseInArr, 1, newObjSpouse);
      }
    } else {
      // освободть позицию: всех верхних и нижних сдвинуть вправо, в своем ряду - персону и всех справа
      arrAllPsns.forEach((element) => {
        if (
          element.level > psnLevel ||
          (element.level < psnLevel && element.level > 0) ||
          (element.level === psnLevel && element.pozX >= psnPozX)
        ) {
          element.pozX += gridstepX;
        }
      });
      let indexSpouseInArr = indexPsnByLongname(spouseLongName, arrAllPsns);
      if (indexSpouseInArr > -1) {
        let newObjSpouse = setPsnAttributes(
          arrAllPsns[indexSpouseInArr],
          psnPozX,
          psnPozY,
          psnLevel
        );
        arrAllPsns.splice(indexSpouseInArr, 1, newObjSpouse);
      }
    }
  } else {
    // разместить жену справа от него
    let spousePozX = psnPozX + gridstepX;
    // есть ли кто-то позиции размещения
    let somebodyInPozX = arrAllPsns.filter(
      (elem) => elem.pozX < spousePozX + gridstepX && elem.pozX >= spousePozX
    );
    let isBusy = somebodyInPozX.length > 0 ? true : false;
    if (isBusy) {
      //  освободить позицию
      arrAllPsns.forEach((element) => {
        if (
          element.level > psnLevel ||
          (element.level < psnLevel && element.level > 0) ||
          (element.level === psnLevel && element.pozX > psnPozX)
        ) {
          element.pozX += gridstepX;
        }
      });
      let indexSpouseInArr = indexPsnByLongname(spouseLongName, arrAllPsns);
      if (indexSpouseInArr > -1) {
        arrAllPsns[indexSpouseInArr].pozX = spousePozX;
        let newObjSpouse = setPsnAttributes(
          arrAllPsns[indexSpouseInArr],
          spousePozX,
          psnPozY,
          psnLevel
        );
        arrAllPsns.splice(indexSpouseInArr, 1, newObjSpouse);
        console.log(newObjSpouse);
      }
    } else {
      let indexSpouseInArr = indexPsnByLongname(spouseLongName, arrAllPsns);
      if (indexSpouseInArr > -1) {
        let newObjSpouse = setPsnAttributes(
          arrAllPsns[indexSpouseInArr],
          spousePozX,
          psnPozY,
          psnLevel
        );
        arrAllPsns.splice(indexSpouseInArr, 1, newObjSpouse);
        console.log(newObjSpouse);
      }
    }
  }

  return arrAllPsns;
}
export default insertSpouseLeftBranch;
