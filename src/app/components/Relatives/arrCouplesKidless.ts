import { IPersonCard } from "../../models/psnCardType";
import { ISpouseType } from "../../models/spousesType";
import { IcouplesWithoutKids } from "../../models/couplesWithoutKidsType";

function arrCouplesKidless(
  isMan: boolean,
  spouses: ISpouseType[],
  arrPersonsLevel3: IPersonCard[],
  arrPersonsLevel4: IPersonCard[],
  arrPersonsLevel5: IPersonCard[],
  arrPersonsLevel6: IPersonCard[]
) {
  const doTheyCoupleWithoutKids = (
    longnameMan: string,
    longnameWoman: string,
    arrPersonsNextLevel: IPersonCard[]
  ): boolean => {
    if (arrPersonsNextLevel.length === 0) {
      return true;
    }
    if (!longnameMan || !longnameWoman) {
      return false;
    }

    if (arrPersonsNextLevel.length > 0) {
      let kidIndex = arrPersonsNextLevel.findIndex(
        (elem) => elem.dad === longnameMan && elem.mother === longnameWoman
      );
      if (kidIndex > -1) {
        return false;
      } else {
        return true;
      }
    }
    return true;
  };

  const wifeLongname = (longnamePerson: string, spouses: ISpouseType[]) => {
    let wifeIndex = spouses.findIndex(
      (elem) => elem.husband === longnamePerson
    );
    let curWife = "";
    if (wifeIndex > -1) {
      curWife = spouses[wifeIndex].wife;
    }
    return curWife;
  };

  const personSpouseIndex = (spouseLongname:string, arrPersonLevel: IPersonCard[]) => {
    let spouseIndex = -1;

    if (spouseLongname) {
      spouseIndex = arrPersonLevel.findIndex(
        (elem) => elem.longname === spouseLongname
      );
    }
    return spouseIndex;
  };

  const findCouplesWithoutKids = (
    arrPersonsLevel: IPersonCard[],
    arrPersonNextLevel: IPersonCard[],
    spouses: ISpouseType[]
  ): IcouplesWithoutKids[] => {
    let couplesWithoutKids: IcouplesWithoutKids[] = [];
    if (arrPersonsLevel.length > 0) {
      for (let psnIndex = 0; psnIndex < arrPersonsLevel.length; psnIndex++) {
        let curPerson = arrPersonsLevel[psnIndex].longname;
        let curWife = wifeLongname(curPerson, spouses);
        let wifeIndex = personSpouseIndex(curWife, arrPersonsLevel);

        // наличие общих детей
        let haveNoChildren = false;
        haveNoChildren = doTheyCoupleWithoutKids(
          curPerson,
          curWife,
          arrPersonNextLevel
        );

        if (haveNoChildren && wifeIndex > -1) {
          // детей нет
          couplesWithoutKids.push({
            xHusband: arrPersonsLevel[psnIndex].pozX,
            yHusband: arrPersonsLevel[psnIndex].pozY,
            xWife: arrPersonsLevel[wifeIndex].pozX,
            yWife: arrPersonsLevel[wifeIndex].pozY,
          });
        }
      }
    } // уровень отработан
    return couplesWithoutKids;
  };

  let arrCouplesWithoutKids: IcouplesWithoutKids[] = [];
  let arrTemp = [];
  let arrPersonsLevel7: IPersonCard[] = [];

  arrTemp = findCouplesWithoutKids(arrPersonsLevel4, arrPersonsLevel5, spouses);
  arrCouplesWithoutKids = arrCouplesWithoutKids.concat(arrTemp);
  arrTemp = findCouplesWithoutKids(arrPersonsLevel5, arrPersonsLevel6, spouses);
  arrCouplesWithoutKids = arrCouplesWithoutKids.concat(arrTemp);
  arrTemp = findCouplesWithoutKids(arrPersonsLevel6, arrPersonsLevel7, spouses);
  arrCouplesWithoutKids = arrCouplesWithoutKids.concat(arrTemp);
  arrTemp = findCouplesWithoutKids(arrPersonsLevel3, arrPersonsLevel4, spouses);
  arrCouplesWithoutKids = arrCouplesWithoutKids.concat(arrTemp);

  return arrCouplesWithoutKids;
}
export default arrCouplesKidless;
