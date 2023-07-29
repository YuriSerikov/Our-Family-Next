import { IPersonCard } from "../../models/psnCardType";
import { IExspouseType } from "../../models/exsposesType"

const findExSpouses = (objPerson: IPersonCard, arrAllPersons: IPersonCard[], exspouses: IExspouseType[]) => {
  const personGender = objPerson.gender;
  const personLongname = objPerson.longname;
  let personExspouses: IPersonCard[] = [];

  let exspouseLongnames =
    personGender === "Man"
      ? exspouses.filter((elem) => elem.ex_husband === personLongname)
      : exspouses.filter((elem) => elem.ex_wife === personLongname);
  if (exspouseLongnames.length === 0) {
    return personExspouses;
  }
  for (let i = 0; i < exspouseLongnames.length; i++) {
    let objTemp: IPersonCard
    let j =
      personGender === "Man"
        ? arrAllPersons.findIndex(
            (elem) => elem.longname === exspouseLongnames[i].ex_wife
          )
        : arrAllPersons.findIndex(
            (elem) => elem.longname === exspouseLongnames[i].ex_husband
          );
    if (j !== -1) {
      objTemp = arrAllPersons[j];
      personExspouses.push(objTemp);
    }
  }
  return personExspouses;
};
export default findExSpouses;
