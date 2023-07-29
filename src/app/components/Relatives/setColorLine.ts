import areMarried from "../Familytree/areMarried";
import { IPersonCard } from "../../models/psnCardType";
import {ISpouseType} from '../../models/spousesType'

const setColorLine = (arrPersons: IPersonCard[] , newColor: string, spouses:ISpouseType[]) => {
  if (arrPersons.length > 0 && spouses.length > 0) {
    for (let level = 7; level > 1; level--) {
      let arrKids = arrPersons.filter((elem) => elem.level === level);
      if (arrKids.length > 0) {
        for (let i = 0; i < arrKids.length; i++) {
          let dad = arrKids[i].dad;
          let mom = arrKids[i].mother;
          if (dad && mom) {
            let theyMarried = areMarried(spouses, dad, mom);
            if (!theyMarried) {
              let q = arrPersons.findIndex(
                (elem) => elem.longname === arrKids[i].longname
              );
              if (q !== -1) {
                arrPersons[q].lineColor = newColor;
              }
            }
          }
        }
      }
    }
  }

  return arrPersons;
};
export default setColorLine;
