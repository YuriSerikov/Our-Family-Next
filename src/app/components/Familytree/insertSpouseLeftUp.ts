import { constRelTree } from "@/app/components/Relatives/constRelTree";
import { IPersonCard } from "../../models/psnCardType";

const insertSpouseLeftUp = (objPerson:IPersonCard, objSpouse:IPersonCard, arrAllPersons:IPersonCard[]) => {
  if (!objSpouse || !objPerson) {
    return arrAllPersons;
  }

  let indexSpouseInArr = -1;
  const gridstepX = constRelTree.miniWidth + constRelTree.marginCard;
  const personLevel = objPerson.level;
  const personPozX = objPerson.pozX;
  const personPozY = objPerson.pozY;
  const personGender = objPerson.gender;

  // найти супруга в массиве
  indexSpouseInArr = arrAllPersons.findIndex(
    (elem) => elem.longname === objSpouse.longname
  );

  if (indexSpouseInArr !== -1) {
    arrAllPersons[indexSpouseInArr].level = personLevel;
    arrAllPersons[indexSpouseInArr].pozY = personPozY;

    if (personGender === "Man") {
      // добавляем жену - вставить справа от мужа
      // если позиция справа свободна - занять ее, иначе всех сдвинуть вправо

      let pozIsFree =
        arrAllPersons.filter(
          (elem) =>
            elem.pozX >= personPozX + gridstepX &&
            elem.pozX < personPozX + 2 * gridstepX &&
            elem.level === personLevel
        ).length > 0
          ? false
          : true;

      if (pozIsFree) {
        arrAllPersons[indexSpouseInArr].pozX = personPozX + gridstepX;
      } else {
        // сдвиг вправо, чтобы освободить позицию
        // в своем ряду - всех правее мужа, в остальных - всех
        arrAllPersons.forEach((elem) => {
          elem.pozX =
            (elem.level !== personLevel && elem.level !== 0) ||
            (elem.level === personLevel && elem.pozX > personPozX)
              ? elem.pozX + gridstepX
              : elem.pozX;
        });
        arrAllPersons[indexSpouseInArr].pozX = personPozX + gridstepX;
      }
    } else {
      // вставить мужа слева
      // в своем ряду сдвигаем всех, включая жену.
      arrAllPersons.forEach((elem) => {
        elem.pozX =
          (elem.level !== personLevel && elem.level !== 0) ||
          (elem.level === personLevel && elem.pozX >= personPozX)
            ? elem.pozX + gridstepX
            : elem.pozX;
      });
      arrAllPersons[indexSpouseInArr].pozX = personPozX;
    }
  }

  return arrAllPersons;
};
export default insertSpouseLeftUp;
