import getRelativesAll from '../../API/Persons_CQL/Relations/getRelativesAll'
import getSpousesAll from '../../API/Persons_CQL/Relations/getSpousesAll'
import { relConst } from '../../API/Persons_CQL/Relations/relConst'
import { constRelTree } from '../Relatives/constRelTree'
import newPersonObj from '../Relatives/newPersonObj'
import addSpaceCaseManWomanNotMarried from './addSpaceCaseManWomanNotMarried'
import setColorLine from '../Relatives/setColorLine'
import rightBranch2 from './rightBranch2'
import rightUpperBranch from './rightUpperBranch'
import leftBranch from './leftBranch'
import leftUpperBranch from './leftUpperBranch'
import arrCouplesKidless from '../Relatives/arrCouplesKidless'
import joinSamePsnElements from './joinSamePsnElements'
import buildDirectBranch from '../Relatives/buildDirectBranch'
import { IPersonCard } from '../../models/psnCardType'
import { IReturnObj } from '../../models/returnObjType'
import { IcouplesWithoutKids } from '../../models/couplesWithoutKidsType'
import addMiniCardsToTree from '../Relatives/addMiniCardsToTree'

async function TreeBuilding(curPerson: string, cbRelatives: any) {
  const relMomDad = relConst.relationDadOrMom
  const relHusband = relConst.relationHusband
  const relExHusband = relConst.relationExHusband

  let arrAllRelPersons: IPersonCard[] = []
  let mainPersons: IPersonCard[]  = []
  
  let spouses: {husband: string, wife: string}[] = []
  let exspouses: {ex_husband: string, ex_wife: string}[] = []
  let keyPersonGender = ''
  let arrLevel2 = []
  let relIcons: IReturnObj = {
    arrIcons: [],
    loading: true,
    arrCouplesWithoutKids: [],
  }
  const defaultLineColor = constRelTree.lineColor
  const lineColorToDevorced = 'blue'

  //const x0 = gridstepX * 4 + mgn;
  //const y0 = constRelTree.startPointY + gridstepY;

  const cbPersons =
    (recievedPersons: { parent: string, relation: string, longname: string, gender: string, minicard: string }[]) => {
    let arrTemp = []
    if (recievedPersons.length > 0) {
      for (let i = 0; i < recievedPersons.length; i++) {
        let DadOrMom = recievedPersons[i].relation
        let parent = recievedPersons[i].parent

        let person = newPersonObj(
          0,
          recievedPersons[i].longname,
          recievedPersons[i].gender,
          recievedPersons[i].minicard, 
          0,
          0,
          defaultLineColor,
          DadOrMom === 'ОТЕЦ' ? parent : '',
          DadOrMom === 'МАТЬ' ? parent : ''
        )
        arrTemp.push(person)
      }
      arrAllRelPersons = arrAllRelPersons.concat(arrTemp)
    }
  }

  const cbHusband = (recievedPersons:{longnameHusband:string, longnameWife: string}[]) => {
    let arrTemp = []
    if (recievedPersons.length > 0) {
      for (let i = 0; i < recievedPersons.length; i++) {
        let husband = recievedPersons[i].longnameHusband
        let wife = recievedPersons[i].longnameWife
        arrTemp.push({
          husband,
          wife,
        })
      }
      spouses = spouses.concat(arrTemp)
    }
  }

  const cbExHusband = (recievedPersons:{longnameHusband:string, longnameWife: string}[]) => {
    let arrTemp = []
    if (recievedPersons.length > 0) {
      for (let i = 0; i < recievedPersons.length; i++) {
        let ex_husband = recievedPersons[i].longnameHusband
        let ex_wife = recievedPersons[i].longnameWife
        arrTemp.push({
          ex_husband,
          ex_wife,
        })
      }
      exspouses = exspouses.concat(arrTemp)
    }
  }

  try {
    // создать массив родственников, отстоящих от ключевой персоны на 1 - 6 отношений,
    // т.е. до троюродных братьев и сестер

    await getRelativesAll(curPerson, relMomDad, cbPersons)

    // объединить элементы - персона-ОТЕЦ и персона-МАТЬ
    arrAllRelPersons = joinSamePsnElements(arrAllRelPersons)

    mainPersons = arrAllRelPersons.filter((elem) => elem.longname === curPerson)
    keyPersonGender = mainPersons[0].gender

    // создать массив супружеских пар
    await getSpousesAll(relHusband, cbHusband)

    // создать массив пар в разводе
    await getSpousesAll(relExHusband, cbExHusband)

    // ---------- начало построения прямой линии родства
    let arrDirectRelPersons = buildDirectBranch(curPerson, arrAllRelPersons, spouses, exspouses)
    // исключить из общего массива элементы, составляющию прямую ветвь
    //console.log(arrDirectRelPersons);

    for (let indexDirect = 0; indexDirect < arrDirectRelPersons.length; indexDirect++) {
      let directRelLongname: string = arrDirectRelPersons[indexDirect].longname
      let indexCommonArr: number =
        arrAllRelPersons.findIndex((elem: IPersonCard) => elem.longname === directRelLongname)

      if (indexCommonArr > -1) {
        arrAllRelPersons.splice(indexCommonArr, 1, arrDirectRelPersons[indexDirect])
      }
    }

    // супруг и/или экс супруги
    let spouse: IPersonCard | null = null
    let spouseLongname = ''
    let indexSpouse = -1
    if (keyPersonGender === 'Man') {
      indexSpouse = spouses.findIndex((elem) => elem.husband === curPerson)
    } else {
      indexSpouse = spouses.findIndex((elem) => elem.wife === curPerson)
    }
    if (indexSpouse > -1) {
      spouseLongname = keyPersonGender === 'Man' ? spouses[indexSpouse].wife : spouses[indexSpouse].husband
      let spouseIndexInArr = arrAllRelPersons.findIndex((elem) => elem.longname === spouseLongname)
      if (spouseIndexInArr > -1) {
        spouse = arrAllRelPersons[spouseIndexInArr]
      }
    }

    // добавить промежуток в комбинации мужчина-женщина, не связанные браком
    for (let levelNum = 4; levelNum < 7; levelNum++) {
      let arrLevel = arrAllRelPersons.filter((elem) => elem.level === levelNum)
      let arrOthers = arrAllRelPersons.filter((elem) => elem.level !== levelNum)
      if (arrLevel.length > 1) {
        arrLevel = addSpaceCaseManWomanNotMarried(arrLevel, spouses)
      }
      arrAllRelPersons = arrOthers.concat(arrLevel)
    }

    // ------------ конец алгоритма построения прямой линии родства

    // добавить братьев и сестер
    // если ключевая персона в браке, то собрать братьев и сестер мужа и жены: ветви мужа - слева, жены - справа
    // если - не в браке, только его/ее братьев и сестер
    let leftMainPerson: IPersonCard | null = null
    let rightMainPerson: IPersonCard | null = null

    if (spouse) {
      if (keyPersonGender === 'Man') {
        leftMainPerson = mainPersons[0]
        rightMainPerson = spouse
      } else {
        leftMainPerson = spouse
        rightMainPerson = mainPersons[0]
      }
    } else {
      rightMainPerson = mainPersons[0]
    }

    // первая левая ветвь: братья и сестры ключевой персоны слева
    const buildLeftBranch = true
    if (buildLeftBranch) {
      if (leftMainPerson) {
        arrAllRelPersons = leftBranch(leftMainPerson, arrAllRelPersons, spouses, exspouses)
      }
    }
    arrLevel2 = arrAllRelPersons.filter((elem) => elem.level === 2)

    const coupleOrderLevel2 = (dad: string | undefined, mom: string | undefined, arrParents: IPersonCard[]) => {
      let psnDad = null
      let psnMom = null
      let couple = []
      let coupleRightPsn = null
      let coupleLeftPsn = null

      if (mom) {
        let indexMom = arrParents.findIndex((elem) => elem.longname === mom)
        if (indexMom > -1) {
          psnMom = arrParents[indexMom]
          couple.push(psnMom)
        }
      }

      if (dad) {
        let indexDad = arrParents.findIndex((elem) => elem.longname === dad)
        if (indexDad > -1) {
          psnDad = arrParents[indexDad]
          couple.push(psnDad)
        }
      }
      couple.sort((a, b) => a.pozX - b.pozX)

      if (couple.length > 1) {
        coupleRightPsn = couple[1]
        coupleLeftPsn = couple[0]
      } else if (couple.length === 1) {
        coupleRightPsn = couple[0]
        coupleLeftPsn = null
      } else {
        coupleRightPsn = null
        coupleLeftPsn = null
      }

      return { coupleLeftPsn, coupleRightPsn }
    }

    // построение верхних левых ветвей
    // первая идет от родителей левого родителя левой ключевой персоны
    const findGrandParents =
      (gradpaLongname: string | undefined, gradmaLongname: string | undefined, arrAllPsns: IPersonCard[]) => {
      let objPsn1: IPersonCard | null = null
      let objPsn2: IPersonCard | null = null

      let indexGrandpa = !!gradpaLongname ? arrAllPsns.findIndex((elem:IPersonCard) => elem.longname === gradpaLongname) : -1
      let indexGrandma = !!gradmaLongname ? arrAllPsns.findIndex((elem:IPersonCard) => elem.longname === gradmaLongname) : -1

      if (indexGrandpa !== -1 && indexGrandma !== -1) {
        objPsn1 = arrAllPsns[indexGrandpa]
        objPsn2 = arrAllPsns[indexGrandma]
      } else if (indexGrandpa !== -1 && indexGrandma === -1) {
        objPsn1 = arrAllPsns[indexGrandpa]
        objPsn2 = null
      } else if (indexGrandpa === -1 && indexGrandma !== -1) {
        objPsn1 = arrAllPsns[indexGrandma]
        objPsn2 = null
      }
      return { objGrandParent1: objPsn1, objGrandParent2: objPsn2 }
    }

    const buildLeftUpperBranch =
      (gradpa: string | undefined, gradma: string | undefined, arrAllPsns: IPersonCard[], colorLine: string) => {
      const objPsn1 = findGrandParents(gradpa, gradma, arrAllPsns).objGrandParent1
      const objPsn2 = findGrandParents(gradpa, gradma, arrAllPsns).objGrandParent2

      arrAllPsns = leftUpperBranch(objPsn1, objPsn2, arrAllPsns, spouses, exspouses, colorLine)
      return arrAllPsns
    }

    if (leftMainPerson) {
      // определить кто слева во 2-ом уровне (в левой паре)
      let leftCouple: { coupleLeftPsn: IPersonCard | null, coupleRightPsn: IPersonCard | null } =
        coupleOrderLevel2(leftMainPerson.dad, leftMainPerson.mother, arrLevel2)
      let leftCoupleLeftPsn = leftCouple.coupleLeftPsn
      let leftCoupleRightPsn = leftCouple.coupleRightPsn

      const leftFirstUpperBranchIsOn = true
      if (!!leftCoupleLeftPsn && leftFirstUpperBranchIsOn) {
        //  построение первой верхней левой ветви
        arrAllRelPersons = buildLeftUpperBranch(
          leftCoupleLeftPsn.dad,
          leftCoupleLeftPsn.mother,
          arrAllRelPersons,
          'green',
        )
      }

      const leftSecondtUpperBranchIsOn = true
      if (!!leftCoupleRightPsn && leftSecondtUpperBranchIsOn) {
        //  построение второй верхней левой ветви
        arrAllRelPersons = buildLeftUpperBranch(
          leftCoupleRightPsn.dad,
          leftCoupleRightPsn.mother,
          arrAllRelPersons,
          'brown',
        )
      }
    }

    const buildRightUpperBranch =
      (gradpa: string | undefined, gradma: string | undefined, arrAllPsns: IPersonCard[], colorLine: string) => {
      const objPsn1 = findGrandParents(gradpa, gradma, arrAllPsns).objGrandParent1
      const objPsn2 = findGrandParents(gradpa, gradma, arrAllPsns).objGrandParent2

      if (arrAllPsns.length === 0) {
        return []
      }

      arrAllPsns = rightUpperBranch(objPsn1, objPsn2, arrAllPsns, spouses, exspouses, colorLine)
      return arrAllPsns
    }

    if (rightMainPerson) {
      // первая правая ветвь: братья и сестры ключевой персоны справа
      const buildRightBranch = true
      if (buildRightBranch) {
        arrAllRelPersons = rightBranch2(rightMainPerson, arrAllRelPersons, spouses, exspouses)
      }
      //определить кто слева во 2-ом уровне (в правой паре)
      let rightCouple = coupleOrderLevel2(rightMainPerson.dad, rightMainPerson.mother, arrLevel2)
      let rightCoupleLeftPsn = rightCouple.coupleLeftPsn
      let rightCoupleRightPsn = rightCouple.coupleRightPsn

      //rightCoupleLeftPsn = null
      const rightFirstUpperBranchIsOn = true
      if (!!rightCoupleLeftPsn && rightFirstUpperBranchIsOn) {
        //  построение первой верхней правой ветви: от левого родителя правой персоны
        arrAllRelPersons = buildRightUpperBranch(
          rightCoupleLeftPsn.dad,
          rightCoupleLeftPsn.mother,
          arrAllRelPersons,
          'brown',
        )
      }

      const rightSecondUpperBranchIsOn = true
      if (!!rightCoupleRightPsn && rightSecondUpperBranchIsOn) {
        // построение второй верхней правой ветки: от правого родителя правой персоны
        arrAllRelPersons = buildRightUpperBranch(
          rightCoupleRightPsn.dad,
          rightCoupleRightPsn.mother,
          arrAllRelPersons,
          'green',
        )
      }
    }

    // изменить цвет линии персона - отец/мать в разводе
    arrAllRelPersons = setColorLine(arrAllRelPersons, lineColorToDevorced, spouses)

    // исключение 0-ого уровня из выходных данных
    arrAllRelPersons = arrAllRelPersons.filter((elem) => elem.level !== 0)
    // построение дерева закончено

    // добавить изображения карточек
    arrAllRelPersons = await addMiniCardsToTree(arrAllRelPersons)

    // создать массив супругов без детей, чтобы затем соединить их линией 
    let arrCouplesWithoutKids: IcouplesWithoutKids[] = []
    let isMan = keyPersonGender === 'Man' ? true : false
    arrCouplesWithoutKids = arrCouplesKidless(
      isMan,
      spouses,
      arrAllRelPersons.filter((elem) => elem.level === 3),
      arrAllRelPersons.filter((elem) => elem.level === 4),
      arrAllRelPersons.filter((elem) => elem.level === 5),
      arrAllRelPersons.filter((elem) => elem.level === 6),
    )

    relIcons =
     {
      arrIcons: arrAllRelPersons,
      loading: false,
      arrCouplesWithoutKids: arrCouplesWithoutKids,
    }

    cbRelatives(relIcons)
  } catch (error) {
    console.error('Ошибка обращения к БД: ' + error)
    console.log('Ошибка БД при построении "Семейного дерева')
  }
}
export default TreeBuilding
