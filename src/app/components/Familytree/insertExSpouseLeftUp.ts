import { constRelTree } from "@/app/components/Relatives/constRelTree";
import { IPersonCard } from "../../models/psnCardType";

const insertExSpouseLeftUp = (objPerson:IPersonCard, objExSpouse:IPersonCard, arrAllPersons:IPersonCard[]) => {
  let indexExSpouseInArr = -1;
  const gridstepX = constRelTree.miniWidth + constRelTree.marginCard;
  const personLevel = objPerson.level;
  const personPozY = objPerson.pozY;
  const personPozX = objPerson.pozX;
  const personGender = objPerson.gender;
  if (!objExSpouse) {
    return arrAllPersons;
  }
  // найти экс-супруга в массиве
  indexExSpouseInArr = arrAllPersons.findIndex(
    (elem) => elem.longname === objExSpouse.longname
  );
  if (indexExSpouseInArr !== -1) {
    arrAllPersons[indexExSpouseInArr].level = personLevel;
    arrAllPersons[indexExSpouseInArr].pozY = personPozY;

    if (personGender === "Man") {
      // вставить экс-жену слева
      // если позиция слева свободна - занять ее, иначе всех сдвинуть вправо

      let pozIsFree =
        arrAllPersons.filter(
          (elem) =>
            elem.pozX >= personPozX - gridstepX &&
            elem.pozX <= personPozX &&
            elem.level === personLevel
        ).length > 0
          ? false
          : true;
      if (pozIsFree && personPozX - gridstepX > 0) {
        arrAllPersons[indexExSpouseInArr].pozX = personPozX - gridstepX;
      } else {
        // сдвиг вправо
        arrAllPersons.forEach((elem) => {
          elem.pozX =
            (elem.level !== personLevel && elem.level !== 0) ||
            (elem.level === personLevel && elem.pozX >= personPozX)
              ? elem.pozX + gridstepX
              : elem.pozX;
        });
        arrAllPersons[indexExSpouseInArr].pozX = personPozX;
      }
    } else {
      // вставить экс-мужа справа
      arrAllPersons.forEach((elem) => {
        elem.pozX =
          (elem.level !== personLevel && elem.level !== 0) ||
          (elem.level === personLevel && elem.pozX > personPozX)
            ? elem.pozX + gridstepX
            : elem.pozX;
      });
      arrAllPersons[indexExSpouseInArr].pozX = personPozX + gridstepX;
    }
  }

  return arrAllPersons;
};
export default insertExSpouseLeftUp;
