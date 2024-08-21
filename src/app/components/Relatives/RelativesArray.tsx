import getRelatives1_3 from "../../API/Persons_CQL/Relations/getRelatives1_3";
import { constRelTree } from "./constRelTree";
import { relConst } from "../../API/Persons_CQL/Relations/relConst";
import newPersonObj from "./newPersonObj";
import getSpousesAll from "../../API/Persons_CQL/Relations/getSpousesAll";
import setColorLine from "./setColorLine";
import arrCouplesKidless from "./arrCouplesKidless";
import joinSamePsnElements from "../Familytree/joinSamePsnElements";
import buildDirectBranch from "./buildDirectBranch";
import trimLeftSpace from "./trimLeftSpace";
import { IPersonCard } from '../../models/psnCardType'
import { IcouplesWithoutKids } from '../../models/couplesWithoutKidsType'
import addMiniCardsToTree from "./addMiniCardsToTree";


async function RelativesArray(
  curPerson: string,
  cbRelArray: (relatives: {
    arrIcons: IPersonCard[],
    loading: boolean,
    arrCouplesWithoutKids: IcouplesWithoutKids[]
}) => void) {
  
  let isMan = true;
  let relArray: IPersonCard[] = [];
  let spouses: {husband: string, wife: string}[] = [];
  let exspouses: {ex_husband: string, ex_wife: string}[] = [];
  let arrAllRelPersons: IPersonCard[] = [];

  const defaultLineColor = constRelTree.lineColor;
  const relMomDad = relConst.relationDadOrMom;
  const relHusband = relConst.relationHusband;
  const relExHusband = relConst.relationExHusband;
  const lineColorToDevorced = constRelTree.lineColorToDevorced;

  if (!curPerson) {
    return;
  }

  const cbPersons = (recievedPersons: {
    longname: string, gender: string, relation: string, parent: string, minicard: string
  }[]) => {
    let arrTemp = [];
    if (recievedPersons.length > 0) {
      for (let i = 0; i < recievedPersons.length; i++) {
        let DadOrMom = recievedPersons[i].relation;
        let parent = recievedPersons[i].parent;

        let person = newPersonObj(
          0,
          recievedPersons[i].longname,
          recievedPersons[i].gender,
          recievedPersons[i].minicard,
          0,
          0,
          defaultLineColor,
          DadOrMom === "ОТЕЦ" ? parent : "",
          DadOrMom === "МАТЬ" ? parent : "",
        );
        arrTemp.push(person);
      }
      arrAllRelPersons = arrAllRelPersons.concat(arrTemp);
    }
  };

  const cbHusband = (recievedPersons: {longnameWife: string, longnameHusband: string}[]) => {
    let arrTemp = [];
    if (recievedPersons.length > 0) {
      for (let i = 0; i < recievedPersons.length; i++) {
        let husband = recievedPersons[i].longnameHusband;
        let wife = recievedPersons[i].longnameWife;
        arrTemp.push({
          husband,
          wife,
        });
      }
      spouses = spouses.concat(arrTemp);
    }
  };

  const cbExHusband = (recievedPersons: {longnameWife: string, longnameHusband: string}[]) => {
    let arrTemp = [];
    if (recievedPersons.length > 0) {
      for (let i = 0; i < recievedPersons.length; i++) {
        let ex_husband = recievedPersons[i].longnameHusband;
        let ex_wife = recievedPersons[i].longnameWife;
        arrTemp.push({
          ex_husband,
          ex_wife,
        });
      }
      exspouses = exspouses.concat(arrTemp);
    }
  };

  try {
    // создать массив родственников, отстоящих от ключевой персоны на 1 - 3 отношений
    await getRelatives1_3(curPerson, relMomDad, cbPersons);

    // объединить элементы - персона-ОТЕЦ и персона-МАТЬ
    arrAllRelPersons = joinSamePsnElements(arrAllRelPersons);

    // создать массив супружеских пар
    await getSpousesAll(relHusband, cbHusband);

    // создать массив пар в разводе
    await getSpousesAll(relExHusband, cbExHusband);

    // --- построение ветки прямого родства
    relArray = buildDirectBranch(
      curPerson,
      arrAllRelPersons,
      spouses,
      exspouses
    );

    // изменить цвет линии персона - отец/мать в разводе
    relArray = setColorLine(relArray, lineColorToDevorced, spouses);

    // если слева осталось пустое место - сместиться влево
    relArray = trimLeftSpace(relArray);

    // добавить изображения карточек
    relArray = await addMiniCardsToTree(relArray)
    
    // выбрать и передать координаты бездетных супругов в уровнях 4 - 6
    let arrCouplesWithoutKids: IcouplesWithoutKids[] = [];
    arrCouplesWithoutKids = arrCouplesKidless(
      isMan,
      spouses,
      relArray.filter((elem) => elem.level === 3),
      relArray.filter((elem) => elem.level === 4),
      relArray.filter((elem) => elem.level === 5),
      relArray.filter((elem) => elem.level === 6)
    );

    let relIcons = {
      arrIcons: relArray,
      loading: false,
      arrCouplesWithoutKids: arrCouplesWithoutKids,
    };
    cbRelArray(relIcons);

    arrAllRelPersons = [];
  } catch (error) {
    console.error("Ошибка обращения к БД: " + error);
    console.log("Ошибка при чтении из БД");
  }
}

export default RelativesArray;
