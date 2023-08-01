"use client"

import { IPerson } from "@/app/models/personType"
import { Metadata } from "next"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useCallback, useContext, useRef } from "react"
import getPersonById from '@/app/API/Persons_CQL/getPersonById'
import getNextKin from '@/app/API/Persons_CQL/getNextKin'
import SizeBase64 from "@/app/Utilites/SizeBase64";
import PreviewArea from '@/app/components/PreviewArea/PreviewArea'
import AppCheckBox from "@/app/UI/checkbox/AppCheckBox";
import NearRelatives from '@/app/components/NearRelative/NearRelatives'
import stl from './PersonIdPage.module.css'
import { relativeType } from "@/app/models/relativeType"
import imgManAvatar from "@/images/ico_man256x256.png";
import imgWomanAvatar from "@/images/ico_woman256x256.jpg";
import { Button } from "react-bootstrap"
import ConvertDateRu from "@/app/Utilites/ConvertDateRu"
import { PersonContext } from "@/app/context/PersonContext"
 
export const metadata: Metadata = {
  title: 'Person Data | Our Family'
}

export default function PersonIdPage() {

  const [activePerson, setActivePerson] = useState<string | null>("");
  const [person, setPerson] = useState<IPerson>({ id: 0, labels: ["Person", "Man"], lastname: "", longname: "" });
  const [alive, setAlive] = useState(false);
  const [birthday, setBirthday] = useState('')
  const [lastday, setLastday] = useState('')
  const [iconSize, setIconSize] = useState(0);
  const [father, setFather] = useState<relativeType[]>([{ id: 0, longname: "", minicard: '', gender: "", relation: "" }]);
  const [mother, setMother] = useState<relativeType[]>([{ id: 0, longname: "", minicard: '', gender: "", relation: "" }]);
  const [spouse, setSpouse] = useState<relativeType[]>([{ id: 0, longname: "", minicard: '', gender: "", relation: "" }]);
  const [exSpouses, setExSpouses] = useState<relativeType[]>([
    { id: 0, longname: "", minicard: '', gender: "", relation: "" }
  ]);
  const [kids, setKids] = useState<relativeType[]>([{ id: 0, longname: "", minicard: '', gender: "", relation: "" }]);
  //const [choosenPerson, setChoosenPerson] = useState("");
  //const [choosenPersonGender, setChoosenPersonGender] = useState("");
  const { personLongname } = useContext(PersonContext);

  const router = useRouter()
  const param = useSearchParams()
  let n1 = param.get('name')
  //const finalPixWidth = 256;
  const strDateBirth = " Дата рождения: ";
  const strDateDeath = " Дата   смерти: ";
  //const fullname = decodeURI(personId);
   
  const profession = useRef() as React.MutableRefObject<HTMLTextAreaElement>

  useEffect(() => {
    setActivePerson(personLongname)
  }, [])

  useEffect(() => {
    if (n1) {
      setActivePerson(n1)
      console.log(n1)
    }
  }, [n1])

  const passPerson = (gotPerson: IPerson) => {
    
    if (gotPerson.icon) {
      setIconSize(SizeBase64(gotPerson.icon));
    } else {
      gotPerson.icon = (gotPerson.labels[1] === 'Man') ? imgManAvatar : imgWomanAvatar
    }
    //console.log(gotPerson)
    setPerson(gotPerson);

  };

  const cleanRelative = useCallback((relation: string) => {
    const arrRelativeAbsent = [
      {
        id: 0,
        longname: "",
        minicard: "",
        gender: "",
        relation: "",
      },
    ];
    switch (relation) {
      case "ОТЕЦ":
        setFather(arrRelativeAbsent);
        break;
      case "МАТЬ":
        setMother(arrRelativeAbsent);
        break;
      case "ЖЕНА|МУЖ":
        setSpouse(arrRelativeAbsent);
        break;
      case "`ЭКС_МУЖ`|`ЭКС_ЖЕНА`":
        setExSpouses(arrRelativeAbsent);
        break;
      case "СЫН|ДОЧЬ":
        setKids(arrRelativeAbsent);
        break;
      default:
        break;
    }
    
  }, []);

  const passRelative = useCallback((gotPerson: relativeType[]) => {
    
    switch (gotPerson[0].relation) {
      case "ОТЕЦ":
        setFather(gotPerson);
        break;
      case "МАТЬ":
        setMother(gotPerson);
        break;
      case "ЖЕНА|МУЖ":
        setSpouse(gotPerson);
        break;
      case "`ЭКС_МУЖ`|`ЭКС_ЖЕНА`":
        setExSpouses(gotPerson);
        break;
      case "СЫН|ДОЧЬ":
        setKids(gotPerson);
        break;
      default:
        break;
    }
  }, []);

  //useEffect(() => {
    //setChoosenPerson('');
    //setChoosenPersonGender('Man');
 // }, [])
  
  useEffect(() => {
    const nextKin = [
      "ОТЕЦ",
      "МАТЬ",
      "ЖЕНА|МУЖ",
      "`ЭКС_МУЖ`|`ЭКС_ЖЕНА`",
      "СЫН|ДОЧЬ",
    ];
    console.log(activePerson)
    getPersonById(activePerson, passPerson);

    for (let i = 0; i < 5; i++) {
      cleanRelative(nextKin[i]);
      getNextKin(activePerson, nextKin[i], passRelative);
    }
  }, [cleanRelative, activePerson, passRelative]);

  useEffect(() => {
    let dateB = ''
    let dateL = ''
    if (person.birthday) {
      dateB = ConvertDateRu(person.birthday)
      setBirthday(dateB)
      
    }
    if (person.lastday) {
      dateL = ConvertDateRu(person.lastday)
      setLastday(dateL)
      setAlive(false)
    }
    if (person.alive) {
      if (person.alive.toString().toLowerCase() === 'true') {
        setAlive(true)
      } else {
        setAlive(false)
      }
    }

  },[person])

  const autoGrow = () => {
    if (profession.current.scrollHeight > profession.current.clientHeight) {
      profession.current.style.height = profession.current.scrollHeight + "px";
    }
  };

  const gotoCommonList = () => {
   router.push(`/commonList`)
  };

  /* const cbFarther = (relatives: relativeType[]) => setFather(relatives);
  const cbMother = (relatives: relativeType[]) => setMother(relatives);
  const cbKids = (relatives: relativeType[]) => {setKids(relatives)};
  const cbSpouse = (relatives: relativeType[]) => setSpouse(relatives);
  const cbExSpouses = (relatives: relativeType[]) => { setExSpouses(relatives) }; */

  return (
    <>
      <div className={stl.personForm}>
        <div className={stl.psn_longname}>
          <h3>Карточка персоны: {activePerson} </h3>
        </div>
        <div className={stl.placeImg}>
          <PreviewArea
            imgToShow={person?.icon}
            filename={person.longname}
            filesize={iconSize}
          />
        </div>
        <div>
          <div>
            <label className={stl.label_datein}>
              {strDateBirth}
              <input
                className={stl.dateIn}
                value={birthday ?? ''}
                type="text"
                placeholder="Дата рождения"
                id="birth"
                readOnly
              />
            </label>

            {!alive ? (
            <label>
              {strDateDeath}
              <input
                className={stl.dateIn}  
                value={lastday ?? ''}
                type="text"
                id="end"
                readOnly
              />
            </label>
            ) : (
            <label></label>
            )}
          
            <AppCheckBox label="жив(а)" checked={alive} readOnly />
          </div>

          <div>
            <input
              className={stl.birthplace}
              value={person.birthplace ?? ''}
              type="text"
              placeholder="Место рождения"
              id="birthPlace"
              readOnly
            />
          </div>
          
          <div>
            <textarea
              className={stl.profession}
              value={person.job}
              placeholder="Образование, профессии"
              ref={profession}
              onKeyUp={autoGrow}
              readOnly
            />
          </div>
          <div>
            <textarea
              className={stl.profile}
              value={person.profile}
              placeholder="События жизни"
              readOnly
            />
          </div>
        </div>
      </div>
      <div className={stl.buttonarea}>
          <Button className="appBtnGoBack" onClick={gotoCommonList}>
            Назад в список 
          </Button>   
      </div>
      <div className={stl.rltcontent}>
        <div>
          <h4 className={stl.rltSubHeader}>Близкие родственники </h4>
        </div>
        
        <div>
          <NearRelatives
            persons={spouse}
            personA={person}
          >
            супруг(а)
          </NearRelatives>
          <NearRelatives
            persons={exSpouses}
            personA={person}   
          >
            предыдущие
          </NearRelatives>
        </div>
        <NearRelatives
          persons={father}
          personA={person}
        >
          отец
        </NearRelatives>

        <NearRelatives
          persons={mother}
          personA={person}
        >
          мать
        </NearRelatives>

        <NearRelatives
          persons={kids}
          personA={person}
        >
          дети
        </NearRelatives>
      </div>
    </>
  )
}