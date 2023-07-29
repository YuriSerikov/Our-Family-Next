import { constRelTree } from '@/app/components/Relatives/constRelTree';
import { IPersonCard } from "../../models/psnCardType";

const insertExSpouseMain = (objPerson:IPersonCard, objExSpouse:IPersonCard, arrAllPsns:IPersonCard[]) => {
  let j = -1;
  const mgn = constRelTree.marginCard;
  const gridstepX = constRelTree.miniWidth + mgn;
  const level = objPerson.level;
  const pozYlevel = objPerson.pozY;

  // если персона - женщина, то вставить экс-мужа справа
  // т.е. всех справа сдвинуть на шаг
  const personGender = objPerson.gender;
  const personPozX = objPerson.pozX;
  const exspouseLongname = objExSpouse.longname;

  if (arrAllPsns.length === 0) {
    return arrAllPsns;
  }
  if (!objPerson || !objExSpouse) {
    return arrAllPsns;
  }

  j = arrAllPsns.findIndex((elem) => elem.longname === exspouseLongname);
  if (j === -1) {
    return arrAllPsns;
  }

  arrAllPsns[j].level = level;
  arrAllPsns[j].pozY = pozYlevel;

  if (personGender === "Woman") {
    // вставить экс-мужа справа, т.е
    arrAllPsns.forEach((elem) => {
      elem.pozX =
        elem.level >= level && elem.pozX > personPozX
          ? elem.pozX + gridstepX
          : elem.pozX;
    });
  } else {
    // если персона - мужчина, вставить экс-жену слева
    // т.е. на место персоны
    arrAllPsns.forEach((elem) => {
      elem.pozX =
        elem.level >= level && elem.pozX >= personPozX
          ? elem.pozX + gridstepX + mgn
          : elem.pozX;
    });
  }
  arrAllPsns[j].pozX =
    personGender === "Woman" ? personPozX + gridstepX : personPozX + mgn;
  return arrAllPsns;
};
export default insertExSpouseMain;
