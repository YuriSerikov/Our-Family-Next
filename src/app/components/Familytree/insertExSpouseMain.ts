import { constRelTree } from '@/app/components/Relatives/constRelTree';
import { IPersonCard } from "../../models/psnCardType";

const insertExSpouseMain = (objPerson:IPersonCard, objExSpouse:IPersonCard, arrAllPsns:IPersonCard[]) => {
  let indexExSpouse = -1;
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

  indexExSpouse = arrAllPsns.findIndex((elem) => elem.longname === exspouseLongname);
  if (indexExSpouse === -1) {
    return arrAllPsns;
  }

  arrAllPsns[indexExSpouse].level = level;
  arrAllPsns[indexExSpouse].pozY = pozYlevel;

  if (personGender === "Woman") {
    // вставить экс-мужа справа, т.е
    arrAllPsns.forEach((elem) => {
      elem.pozX =
        elem.level >= level && elem.pozX > personPozX + constRelTree.miniWidth
          ? elem.pozX + gridstepX
          : elem.pozX;
    });
  } else {
    // если персона - мужчина, вставить экс-жену слева
    // т.е. на место персоны
    arrAllPsns.forEach((elem) => {
      elem.pozX =
        elem.level >= level && elem.pozX >= personPozX
          ? elem.pozX + gridstepX+ mgn
          : elem.pozX;
    });
  }
  arrAllPsns[indexExSpouse].pozX =
    personGender === "Woman" ? personPozX + gridstepX : personPozX + mgn;
  return arrAllPsns;
};
export default insertExSpouseMain;
