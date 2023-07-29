import React, { useState, useCallback, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import stl from "./Relatives4Person.module.css";
import { relConst } from "../../API/Persons_CQL/Relations/relConst";
import getNextKin from "../../API/Persons_CQL/getNextKin";
import buildMatch from "../../API/Persons_CQL/Relations/buildMatch";
import getRelatives123longName from "../../API/Persons_CQL/Relations/getRelatives123longName";
import getGrands from "../../API/Persons_CQL/Relations/getGrands";
import getGrandChildren from "../../API/Persons_CQL/Relations/getGrandChildren";
import getGreatGrandChildren from "../../API/Persons_CQL/Relations/getGreatGrandChildren";


const Relatives4Person = (props: {children: string, isMan: boolean; } ) => {
  const { children, isMan } = props;

  const startLongName: string = children; 
  const [spouse, setSpouse] = useState(""); // Супруг
  const [exSpouse, setExSpouse] = useState(""); // Бывший супруг
  const [parentsInLaw_wife, setParentsInLaw_wife] = useState(""); // Тесть и теща
  const [parentsInLaw_husband, setParentsInLaw_husband] = useState(""); // Свекр и свекровь
  const [kids, setKids] = useState(""); // Дети
  const [parents, setParents] = useState(""); // Родители
  const [greatGrandParents, setGreatGrandParents] = useState(""); // Прадедушки и прабабушки:
  const [grandparents, setGrandparents] = useState(""); // Дедушки и бабушки:
  const [grandChildren, setGrandChildren] = useState(""); // Внуки и внучки:
  const [greatGrandChildren, setGreatGrandChildren] = useState(""); // Правнуки и правнучки:
  const [brothers, setBrothers] = useState(""); // Братья и сестры:
  const [uncles, setUncles] = useState(""); // Дяди и тети:
  const [cousins, setCousins] = useState(""); // Племянники и племянницы:
  const [brotherInLaw, setBrotherInLaw] = useState(""); // Шурины и своячницы:
  const [sisterInLaw, setSisterInLaw] = useState(""); // Девери и золовки:
  const [secondBrother, setSecondBrother] = useState(""); // Двоюродные братья и сестры:
  const [greatUncle, setGreatUncle] = useState(""); // Двоюродные дедушки и бабушки:
  const [secondCousin, setSecondCousin] = useState(""); // Двоюродные племянники и племянницы:
  const [grandCousin, setGrandCousin] = useState(""); // Внучатые племянники и племянницы:
  const [secondUncle, setSecondUncle] = useState(""); // Двоюродные дяди и тети:
  const [thirdBrother, setThirdBrother] = useState(""); // Троюродные братья и сестры:
  const [svat, setSvat] = useState(""); // Сват и сватья:

  const closeRelatives = [
    "Прадеды и прабабушки",
    "Дедушки и бабушки",
    "Родители",
    "Дети",
    "Внуки и внучки",
    "Правнуки и правнучки",
    "Братья и сестры",
    "Племянники и племянницы",
    "Внучатые племянники и племянницы",
  ];
  const sideRelatives = [
    "Дяди и тети",
    "Двоюродные братья и сестры",
    "Двоюродные племянники и племянницы",
    "Двоюродные дедушки и бабушки",
    "Двоюродные дяди и тети",
    "Троюродные братья и сестры",
  ];
  const husbandRelatives = [
    "Жена",
    "Бывшая жена",
    "Тесть и теща",
    "Шурины и своячницы",
    "Сват и сватья",
  ];
  const wifeRelatives = [
    "Муж",
    "Бывший муж",
    "Свёкр и свекровь",
    "Девери и золовки",
    "Сват и сватья",
  ];

  interface IPersonLongname {
    id: number,
    longname: string,
    gender: string
  }

  const passSpouse = (persons:IPersonLongname[]) => {
    let spouseLongname = "";
    if (persons.length) {
      spouseLongname = persons[0].longname;
    }
    setSpouse(spouseLongname);
  };

  const passExSpouses = useCallback((persons:IPersonLongname[]) => {
    let str = "";
    if (persons.length) {
      for (let i = 0; i < persons.length; i++) {
        str = str + persons[i].longname + ", <br>";
      }
    }
    setExSpouse(str);
  }, []);

  const passParentsInLaw = useCallback(
    (persons: IPersonLongname[]) => {
      let str = "";
      if (persons.length > 0) {
        for (let i = 0; i < persons.length; i++) {
          let parentName = persons[i].longname;
          str = str + parentName + ", <br>";
        }
      }
      if (isMan) {
        setParentsInLaw_husband("");
        setParentsInLaw_wife(str);
      } else {
        setParentsInLaw_husband(str);
        setParentsInLaw_wife("");
      }
    },
    [isMan]
  );

  const passKids = (persons: IPersonLongname[]) => {
    let str = "";
    if (persons.length) {
      for (let i = 0; i < persons.length; i++) {
        str = str + persons[i].longname + ", <br>";
      }
    }
    setKids(str);
  };

  const passParents = useCallback((persons:IPersonLongname[]) => {
    let str = "";
    if (persons.length > 0) {
      for (let i = 0; i < persons.length; i++) {
        str = str + persons[i].longname + ",  <br>";
      }
    }
    setParents(str);
  }, []);

  const passGreatGrandParents = (persons:IPersonLongname[]) => {
    let str = "";
    if (persons.length > 0) {
      for (let i = 0; i < persons.length; i++) {
        let greatGrandParentName = persons[i].longname;
        str = str + greatGrandParentName + ", <br>";
      }
      //console.log(str)
    }
    setGreatGrandParents(str);
  };

  const passGrands = (persons: {
    id: number,
        longnameParent: string,
        relationGrand: string,
        longnameGrand: string
  }[]) => {
    let str = "";
    setGrandparents("");
    if (persons.length > 0) {
      for (let i = 0; i < persons.length; i++) {
        let grand = persons[i].longnameGrand;
        str = str + grand + ", <br>";
      }
    }
    setGrandparents(str);
  };
  const passGrandChildren = (persons: {
    id: number,
    longnameChild: string,
    genderChild: string,
    relationGrandChild: string,
    longnameGrandChild: string,
    genderGrandChild:string
  }[]) => {
    let str = "";
    if (persons.length > 0) {
      for (let i = 0; i < persons.length; i++) {
        let grandChildrenName = persons[i].longnameGrandChild;
        str = str + grandChildrenName + ", <br>";
      }
    }
    setGrandChildren(str);
  };

  const passGreatGrandChildren = (persons: {
    id: number,
    relationChild: string ,
    longnameChild: string ,
    genderChild: string ,
    relationGrandChild: string ,
    longnameGrandChild: string ,
    genderGrandChild: string
  }[]) => {
    let str = "";
    if (persons.length > 0) {
      for (let i = 0; i < persons.length; i++) {
        let greatGrandChild = persons[i].longnameGrandChild;
        str = str + greatGrandChild + ", <br>";
      }
    }
    setGreatGrandChildren(str);
  };

  const passBrothers = (persons:IPersonLongname[]) => {
    let str = "";
    if (persons.length > 0) {
      let checkNames = "";
      for (let i = 0; i < persons.length; i++) {
        let childName = persons[i].longname;
        if (checkNames.indexOf(childName) === -1) {
          checkNames = checkNames + childName;
          str = str + childName + ", <br>";
        }
      }
    }
    setBrothers(str);
  };
  const passUncles = (persons:IPersonLongname[]) => {
    let str = "";
    if (persons.length > 0) {
      let checkNames = "";
      for (let i = 0; i < persons.length; i++) {
        let uncleName = persons[i].longname;
        if (checkNames.indexOf(uncleName) === -1) {
          checkNames = checkNames + uncleName;
          str = str + uncleName + ", <br>";
        }
      }
    }
    setUncles(str);
  };
  const passCousins = (persons:IPersonLongname[]) => {
    let str = "";
    if (persons.length > 0) {
      let checkNames = "";
      for (let i = 0; i < persons.length; i++) {
        let cousinName = persons[i].longname;
        if (checkNames.indexOf(cousinName) === -1) {
          checkNames = checkNames + cousinName;
          str = str + cousinName + ", <br>";
        }
      }
    }
    setCousins(str);
  };
  const passWifeBrother = useCallback(
    (persons:IPersonLongname[]) => {
      let str = "";
      if (persons.length > 0) {
        let checkNames = "";
        for (let i = 0; i < persons.length; i++) {
          let brotherInLawName = persons[i].longname;
          if (checkNames.indexOf(brotherInLawName) === -1) {
            checkNames = checkNames + brotherInLawName;
            str = str + brotherInLawName + ", <br>";
          }
        }
      }
      if (isMan) {
        setBrotherInLaw(str);
        setSisterInLaw("");
      } else {
        setSisterInLaw(str);
        setBrotherInLaw("");
      }
    },
    [isMan]
  );

  const passSecondBrother = (persons:IPersonLongname[]) => {
    let str = "";
    if (persons.length > 0) {
      let checkNames = "";
      for (let i = 0; i < persons.length; i++) {
        let brother2Name = persons[i].longname;
        if (checkNames.indexOf(brother2Name) === -1) {
          checkNames = checkNames + brother2Name;
          str = str + brother2Name + ", <br>";
        }
      }
    }
    setSecondBrother(str);
  };
  const passGreatUncle = (persons:IPersonLongname[]) => {
    let str = "";
    if (persons.length > 0) {
      let checkNames = "";
      for (let i = 0; i < persons.length; i++) {
        let greatUncleName = persons[i].longname;
        if (checkNames.indexOf(greatUncleName) === -1) {
          checkNames = checkNames + greatUncleName;
          str = str + greatUncleName + ", <br>";
        }
      }
    }
    setGreatUncle(str);
  };
  const passSecondCousins = (persons:IPersonLongname[]) => {
    let str = "";
    if (persons.length > 0) {
      //console.log(persons)
      let checkNames = "";
      for (let i = 0; i < persons.length; i++) {
        let secondCousinName = persons[i].longname;
        if (checkNames.indexOf(secondCousinName) === -1) {
          checkNames = checkNames + secondCousinName;
          str = str + secondCousinName + ", <br>";
        }
      }
    }
    setSecondCousin(str);
  };

  const passGrandCousins = (persons:IPersonLongname[]) => {
    let str = "";
    if (persons.length > 0) {
      let checkNames = "";
      for (let i = 0; i < persons.length; i++) {
        let grandCousinName = persons[i].longname;
        if (checkNames.indexOf(grandCousinName) === -1) {
          checkNames = checkNames + grandCousinName;
          str = str + grandCousinName + ", <br>";
        }
      }
    }
    setGrandCousin(str);
  };

  const passSecondUncles = (persons:IPersonLongname[]) => {
    let str = "";
    if (persons.length > 0) {
      let checkNames = "";
      for (let i = 0; i < persons.length; i++) {
        let secondUncleName = persons[i].longname;
        if (checkNames.indexOf(secondUncleName) === -1) {
          checkNames = checkNames + secondUncleName;
          str = str + secondUncleName + ", <br>";
        }
      }
    }
    setSecondUncle(str);
  };
  const passThirdBrothers = useCallback(
    (persons:IPersonLongname[]) => {
      let str = "";
      if (persons.length > 0) {
        let checkNames = startLongName;
        for (let i = 0; i < persons.length; i++) {
          let thirdBrotherName = persons[i].longname;
          if (checkNames.indexOf(thirdBrotherName) === -1) {
            checkNames = checkNames + thirdBrotherName;
            str = str + thirdBrotherName + ", <br>";
          }
        }
      }
      setThirdBrother(str);
    },
    [startLongName]
  );

  const passSvat = (persons:IPersonLongname[]) => {
    let str = "";
    if (persons.length > 0) {
      for (let i = 0; i < persons.length; i++) {
        str = str + persons[i].longname + ", <br>";
      }
    }
    setSvat(str);
  };

  useEffect(() => {
    let cql = "";
    // определить жену / мужа
    cql = isMan
      ? buildMatch(startLongName, "wife", "longName")
      : buildMatch(startLongName, "husband", "longName");
    getRelatives123longName(cql, passSpouse);
    // тесть и теща или  свекр и свекровь
    cql = isMan
      ? buildMatch(startLongName, "WifeParents", "longName")
      : buildMatch(startLongName, "HusbandParents", "longName");
    getRelatives123longName(cql, passParentsInLaw);
    // и, если были, экс-супруга(у)
    cql = isMan
      ? buildMatch(startLongName, "ex_wife", "longName")
      : buildMatch(startLongName, "ex_husband", "longName");
    getRelatives123longName(cql, passExSpouses);
    // дети
    getNextKin(startLongName, relConst.relationSunOrDaughter, passKids);
    // родители
    cql = buildMatch(startLongName, "parents", "longName");
    getRelatives123longName(cql, passParents);
    // прадеды
    cql = buildMatch(startLongName, "GreatGrandParents", "longName");
    getRelatives123longName(cql, passGreatGrandParents);
    // дедушки и бабушки
    getGrands(startLongName, relConst.relationDadOrMom, passGrands);
    // внуки
    getGrandChildren(
      startLongName,
      relConst.relationSunOrDaughter,
      passGrandChildren
    );
    // правнуки
    getGreatGrandChildren(
      startLongName,
      relConst.relationSunOrDaughter,
      passGreatGrandChildren
    );
    // братья сестры
    cql = buildMatch(startLongName, "Brothers", "longName");
    getRelatives123longName(cql, passBrothers);
    // дяди и тети
    cql = buildMatch(startLongName, "Uncles", "longName");
    getRelatives123longName(cql, passUncles);
    // племянники и племянницы
    cql = buildMatch(startLongName, "Cousins", "longName");
    getRelatives123longName(cql, passCousins);
    // братья и сестры супруга(и)
    cql = buildMatch(startLongName, "WifeBrother", "longName");
    getRelatives123longName(cql, passWifeBrother);
    // двоюродные братья и сестры
    cql = buildMatch(startLongName, "secondBrothers", "longName");
    //console.log(cql)
    getRelatives123longName(cql, passSecondBrother);
    // двоюродные дедушки и бабушки
    cql = buildMatch(startLongName, "greatUncle", "longName");
    getRelatives123longName(cql, passGreatUncle);
    // двоюродные племянники и племянницы
    cql = buildMatch(startLongName, "secondCousins", "longName");
    getRelatives123longName(cql, passSecondCousins);
    // внучатый племянник
    cql = buildMatch(startLongName, "greatCousins", "longName");
    getRelatives123longName(cql, passGrandCousins);
    // двоюродный дядя
    cql = buildMatch(startLongName, "secondUncle", "longName");
    getRelatives123longName(cql, passSecondUncles);
    // троюродный брат
    cql = buildMatch(startLongName, "thirdBrother", "longName");
    getRelatives123longName(cql, passThirdBrothers);
    // сваты
    cql = buildMatch(startLongName, "svat", "longName");
    getRelatives123longName(cql, passSvat);
  }, [isMan, startLongName]);

  useEffect(() => {
    if (isMan) {
      let elem = document.getElementById("husbandRel_0")
      if (!!elem) { elem.innerHTML = spouse }
      elem = document.getElementById("husbandRel_1")
      if (!!elem) { elem.innerHTML = exSpouse }
      elem = document.getElementById("husbandRel_2")
      if (!!elem) { elem.innerHTML = parentsInLaw_wife }
      elem = document.getElementById("husbandRel_3")
      if (!!elem) { elem.innerHTML = brotherInLaw }
      elem = document.getElementById("husbandRel_4")
      if (!!elem) { elem.innerHTML = svat }
       
    } else {
      let elem = document.getElementById("wifeRel_0")
      if (!!elem) { elem.innerHTML = spouse }
      elem = document.getElementById("wifeRel_1")
      if (!!elem) { elem.innerHTML = exSpouse }
      elem = document.getElementById("wifeRel_2")
      if (!!elem) { elem.innerHTML = parentsInLaw_husband }
      elem = document.getElementById("wifeRel_3")
      if (!!elem) { elem.innerHTML = sisterInLaw }
      elem = document.getElementById("wifeRel_4")
      if (!!elem) { elem.innerHTML = svat }
      
    }
    let elem = document.getElementById("closeRel_0")
    if (!!elem) { elem.innerHTML = greatGrandParents }
    elem = document.getElementById("closeRel_1")
    if (!!elem) { elem.innerHTML = grandparents }
    elem = document.getElementById("closeRel_2")
    if (!!elem) { elem.innerHTML = parents }
    elem = document.getElementById("closeRel_3")
    if (!!elem) { elem.innerHTML = kids }
    elem = document.getElementById("closeRel_4")
    if (!!elem) { elem.innerHTML = grandChildren }
    elem = document.getElementById("closeRel_5")
    if (!!elem) { elem.innerHTML = greatGrandChildren }
    elem = document.getElementById("closeRel_6")
    if (!!elem) { elem.innerHTML = brothers }
    elem = document.getElementById("closeRel_7")
    if (!!elem) { elem.innerHTML = cousins }
    elem = document.getElementById("closeRel_8")
    if (!!elem) { elem.innerHTML = grandCousin }
    
    elem = document.getElementById("sideRel_0")
    if (!!elem) { elem.innerHTML = uncles }
    elem = document.getElementById("sideRel_1")
    if (!!elem) { elem.innerHTML = secondBrother }
    elem = document.getElementById("sideRel_2")
    if (!!elem) { elem.innerHTML = secondCousin }
    elem = document.getElementById("sideRel_3")
    if (!!elem) { elem.innerHTML = greatUncle }
    elem = document.getElementById("sideRel_4")
    if (!!elem) { elem.innerHTML = secondUncle }
    elem = document.getElementById("sideRel_5")
    if (!!elem) { elem.innerHTML = thirdBrother }
    
  }, [
    startLongName,
    spouse,
    exSpouse,
    parentsInLaw_wife,
    parentsInLaw_husband,
    kids,
    parents,
    greatGrandParents,
    grandparents,
    grandChildren,
    greatGrandChildren,
    brothers,
    cousins,
    grandCousin,
    brotherInLaw,
    greatUncle,
    isMan,
    secondBrother,
    secondCousin,
    secondUncle,
    sisterInLaw,
    svat,
    thirdBrother,
    uncles,
  ]);

  return (
    <div className={stl.rlt_table}>
      <Row>
        {/* <h4 className={stl.person}> {startLongName}</h4> */}
        <Col className={stl.first_row}>Кровные родственники </Col>
        <Col className={stl.first_row}>Родственники по браку </Col>
      </Row>
      <Row>
        <Col>
          <Stack gap={1}>
            <>
              {closeRelatives.map((elem, index) => (
                <div className={stl.closerel_head} key={index}>
                  {elem}
                  <div
                    className={stl.closerel}
                    id={"closeRel_" + index}
                    key={"closeRel_" + index}
                  ></div>
                </div>
              ))}
            </>
          </Stack>
        </Col>
        <Col>
          <Stack gap={1}>
            {isMan ? (
              <>
                {husbandRelatives.map((elem, index) => (
                  <div className={stl.closerel_head} key={index}>
                    {elem}
                    <div
                      className={stl.closerel}
                      id={"husbandRel_" + index}
                      key={"husbandRel_" + index}
                    ></div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {wifeRelatives.map((elem, index) => (
                  <div className={stl.closerel_head} key={index}>
                    {elem}
                    <div
                      className={stl.closerel}
                      id={"wifeRel_" + index}
                      key={"wifeRel_" + index}
                    ></div>
                  </div>
                ))}
              </>
            )}
            <div className={stl.first_row}>Боковые родственники</div>
            <>
              {sideRelatives.map((elem, index) => (
                <div className={stl.closerel_head} key={index}>
                  {elem}
                  <div
                    className={stl.closerel}
                    id={"sideRel_" + index}
                    key={"sideRel_" + index}
                  ></div>
                </div>
              ))}
            </>
          </Stack>
        </Col>
      </Row>
    </div>
  );
};

export default Relatives4Person;
