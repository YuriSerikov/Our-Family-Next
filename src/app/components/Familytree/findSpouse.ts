import { IPersonCard } from "../../models/psnCardType";
import { ISpouseType } from "../../models/spousesType";

const findSpouse = (objPerson: IPersonCard, arrAllPersons: IPersonCard[], spouses: ISpouseType[]) => {
  const personGender = objPerson.gender;
  const personLongname = objPerson.longname;
  let personSpouse = null;
  let j =
    personGender === "Man"
      ? spouses.findIndex((elem) => elem.husband === personLongname)
      : spouses.findIndex((elem) => elem.wife === personLongname);

  if (j !== -1) {
    let personSpouseLongname =
      personGender === "Man" ? spouses[j].wife : spouses[j].husband;
    let q = arrAllPersons.findIndex(
      (elem) => elem.longname === personSpouseLongname
    );

    if (q !== -1) {
      personSpouse = arrAllPersons[q];
    }
  }
  return personSpouse;
};
export default findSpouse;
