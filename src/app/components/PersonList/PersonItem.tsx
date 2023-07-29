'use client'

import { useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import imgManAvatar from "../../../images/ico_man40x40.png";
import imgWomanAvatar from "../../../images/icoWoman40x40.png";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import useTip from '../../Hooks/useTip';
import { PersonContext } from '../../context/PersonContext';
import ConvertDateRu from '../../Utilites/ConvertDateRu';
import  SmallBtnAction  from '@/app/UI/miniButtons/SmallBtnAction';
import bootstrapPersonUp from '@/images/bootstrap/person-up.svg'
import "./personItem.css";

const PersonItem = ({ ...props }) => {
  
  const { rowNumber, person } = props 
  const { setPersonLongname } = useContext(PersonContext);
  const router = useRouter()

  const gotoPersonData = () => {
   router.push(`/personInfo/${props.person.longname}`)

  };
  
  let strDates: string = ConvertDateRu(person.lastday)
    ? ConvertDateRu(person.birthday) + ` - ` + ConvertDateRu(person.lastday)
    : ConvertDateRu(person.birthday);
  if (!strDates.trim()) {
    strDates = "__.__.____"
  }

  const iconView = person.icon
    ? person.icon
    : person.labels[1] === "Man"
      ? imgManAvatar
      : imgWomanAvatar;
    
  const popover = useTip("Двойной клик для перехода на страницу персоны.");
  const popoverGoto = useTip('Перейти в карточку родственника')
    
  return (
    <div className={person.labels[1] === "Man" ? "man" : "woman"}>
      <div className="psnBlock" onClick={() => setPersonLongname(person.longname)}>
        <div className="psnPhoto" onDoubleClick ={gotoPersonData}>
          <OverlayTrigger placement="bottom" overlay={popover} >
            <Image src={iconView} width={40} height={40} alt="нет фото" className='psnImage' />
          </OverlayTrigger>
        </div>

        <div className="persondata">
          <strong>
            {rowNumber}.&nbsp; {person.longname}
          </strong>
          <p>
            {strDates}
          </p>
          
        </div>
          <div className='psnBtnGoto'>
            <SmallBtnAction className="smllbtn_Goto" onClick={gotoPersonData}>
              <OverlayTrigger placement="bottom" overlay={popoverGoto} >
                <Image src={bootstrapPersonUp} alt="goto" className="smllbtn_Goto" />
              </OverlayTrigger>
            </SmallBtnAction>
            
          </div>
      </div>
    </div>
    );
};

export default PersonItem;