import { constRelTree } from "@/app/components/Relatives/constRelTree";
import { IPersonCard } from "../../models/psnCardType";

const insertSpouseMain = (objPerson:IPersonCard, objSpouse:IPersonCard | null, arrAllPersons:IPersonCard[]) => {
  let j = -1;
  const gridstepX = constRelTree.miniWidth + constRelTree.marginCard;
  const personLevel = objPerson.level;
  const personPozY = objPerson.pozY;
  const personPozX = objPerson.pozX;
  const personGender = objPerson.gender;
  if (!objSpouse) {
    return arrAllPersons;
  }
  // найти супруга в массиве
  j = arrAllPersons.findIndex((elem) => elem.longname === objSpouse.longname);
  if (j !== -1) {
    arrAllPersons[j].level = personLevel;
    arrAllPersons[j].pozY = personPozY;

    if (personGender === "Man") {
      //  вставить жену справа
      //  если справа никого нет, разместить справа
      let isAnyToRight = arrAllPersons.findIndex(
        (elem) => elem.pozX > personPozX
      );
      if (isAnyToRight === -1) {
        arrAllPersons[j].pozX = personPozX + gridstepX;
      } else {
        // сдвиг уровня - всех справа от персоны
        arrAllPersons.forEach((elem) => {
          elem.pozX =
            elem.level === personLevel && elem.pozX > personPozX
              ? elem.pozX + gridstepX
              : elem.pozX;
        });
        arrAllPersons[j].pozX = personPozX + gridstepX;
      }
    } else {
      //  вставить мужа слева
      // если слева никого нет
      let isAnyToLeft = arrAllPersons.findIndex(
        (elem) => elem.pozX < personPozX
      );
      if (isAnyToLeft === -1) {
        arrAllPersons[j].pozX = personPozX - gridstepX;
      } else {
        // сдвиг уровня - персона и далее
        arrAllPersons.forEach((elem) => {
          elem.pozX =
            elem.level === personLevel && elem.pozX >= personPozX
              ? elem.pozX + gridstepX
              : elem.pozX;
        });
        arrAllPersons[j].pozX = personPozX;
      }
    }
  }
  return arrAllPersons;
};
export default insertSpouseMain;
