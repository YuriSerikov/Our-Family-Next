//import 'bootstrap/dist/css/bootstrap.min.css'
import { useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import SmallBtnAction from '@/app/UI/miniButtons/SmallBtnAction'
import bootstrapPersonUp from '@/images/bootstrap/person-up.svg'
//import getNextKin from '@/app/API/Persons_CQL/getNextKin'
import useTip from '../../Hooks/useTip'
import { PersonContext } from '@/app/context/PersonContext'
import AuthContext from '../../context/AuthContext'

import stl from './NearRelative.module.css'
import Image from 'next/image'

const NearRelatives = (props) => {
  const { persons, personA } = props

  const [curId, setCurId] = useState('')
  //const [activePerson, setActivePerson] = useState('')
  const [isBtnGoDisabled, setIsBtnGoDisabled] = useState(false)

  const auth = useContext(AuthContext)
  const router = useRouter()
  const { personLongname, setPersonLongname } = useContext(PersonContext)
  const title = props.children

  const storeId = (inpt) => {
    const elemId = title + inpt.toString()

    setCurId(elemId)
    // check if element is empty
    const elem = document.getElementById(elemId)
    if (elem) {
      if (!elem.value) {
        setIsBtnGoDisabled(true)
      } else {
        setIsBtnGoDisabled(false)
      }
    }
  }

  const GotoRelative = () => {
    // определить активное поле
    if (!!curId) {
      const elem = document.getElementById(curId)
      // прочитать значение поля
      if (!!elem) {
        const kinB = elem.value

        if (kinB) {
          console.log(kinB)
          setPersonLongname(kinB)
          router.push(`/personInfo?name=${kinB}`)
        }
      }
    }
  }

  const popoverGoto = useTip('Перейти в карточку родственника')

  return (
    <div className={stl.kinblock}>
      <Row>
        <Col className={stl.lblplace}>
          <label className={stl.lbl}>{title}:&nbsp;</label>
        </Col>

        <Col className={stl.inputplace}>
          {persons ? (
            persons.map((person, index) => (
              <input
                className={stl.strNextKin}
                type="text"
                id={title + index}
                value={person.longname ? person.longname : ''}
                readOnly
                key={person.id}
                onClick={(e) => storeId(index)}
              />
            ))
          ) : (
            <input
              className={stl.strNextKin}
              type="text"
              id={title + '0'}
              value=""
              readOnly
              onClick={(e) => storeId('0')}
            />
          )}
        </Col>

        <Col className={stl.btnplace}>
          <SmallBtnAction className="smllbtn_Goto" disabled={isBtnGoDisabled} onClick={GotoRelative}>
            <OverlayTrigger placement="bottom" overlay={popoverGoto}>
              <Image src={bootstrapPersonUp} alt="goto" width={20} height={20} />
            </OverlayTrigger>
          </SmallBtnAction>
        </Col>
      </Row>
    </div>
  )
}

export default NearRelatives
