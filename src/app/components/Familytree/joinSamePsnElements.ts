import { IPersonCard } from "../../models/psnCardType";

function joinSamePsnElements(arrPersons:IPersonCard[]) {
  // из запроса получаем массив с задвоением элементов: у одного заволнено свойство "dad",
  // у другого - своство "mom";
  // или без задвоения, когда второй родитель не известен.
  // заполняем свойства "dad" и "mom" в первом элементе и удаляем второй элемент

  let arrPersonsTemp:IPersonCard[] = [];
  if (arrPersons.length > 0) {
    arrPersonsTemp = arrPersonsTemp.concat(arrPersons);
    for (let i = arrPersonsTemp.length - 1; i >= 0; i--) {
      let person = arrPersonsTemp[i].longname;
      let psnTemp = arrPersonsTemp.filter((elem) => elem.longname === person);

      if (psnTemp.length === 2) {
        let firstPsnIndex = arrPersonsTemp.findIndex((elem) => elem.longname === person);

        let secondPsnIndex = -1 //arrPersonsTemp.findLastIndex((elem: IPersonCard) => elem.longname === person);
        for (let j = arrPersonsTemp.length - 1; j > 0; j--) {
          let elem = arrPersonsTemp[j].longname
          if (elem === person) {
            secondPsnIndex = j
            j = 0
          }
        }

        let father = !!psnTemp[0].dad
          ? psnTemp[0].dad
          : !!psnTemp[1].dad
          ? psnTemp[1].dad
          : "";
        let mother = !!psnTemp[0].mother
          ? psnTemp[0].mother
          : !!psnTemp[1].mother
          ? psnTemp[1].mother
          : "";
        arrPersonsTemp[firstPsnIndex].dad = father;
        arrPersonsTemp[firstPsnIndex].mother = mother;
        if (secondPsnIndex > -1) {
          arrPersonsTemp.splice(secondPsnIndex, 1);
        }
      }
    }
  }

  return arrPersonsTemp;
}
export default joinSamePsnElements;
