//import 'bootstrap/dist/css/bootstrap.min.css'
import { useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import SmallBtnAction from '@/app/UI/miniButtons/SmallBtnAction'
import bootstrapPersonUp from '@/images/bootstrap/person-up.svg'
import getNextKin from '@/app/API/Persons_CQL/getNextKin'
import useTip from '../../Hooks/useTip'

import AuthContext from '../../context/AuthContext'

import stl from './NearRelative.module.css'
import Image from 'next/image'

const NearRelatives = (props) => {
  const { persons, kinToAdd, personA, choosenPersonGender, cbAfterChange } = props

  const [curId, setCurId] = useState('')

  const [spouse, setSpouse] = useState(null)
  const [isBtnGoDisabled, setIsBtnGoDisabled] = useState(false)

  const auth = useContext(AuthContext)
  const router = useRouter()
  //const params = useParams()
  //console.log("params = ", params);

  const title = props.children

  useEffect(() => {
    if (!auth.isAdmin) {
      const elemMiniBtn = document.getElementsByClassName('smllbtn')

      if (elemMiniBtn.length > 0) {
        for (let i = 0; i < elemMiniBtn.length; i++) {
          elemMiniBtn[i].style.display = 'none'
          elemMiniBtn[i].style.visibility = 'hidden'
        }
      }
    }
  }, [auth.isAdmin])

  useEffect(() => {
    const relation = personA.labels[1] === 'Man' ? 'ЖЕНА' : 'МУЖ'
    const cbRelative = (relative) => {
      setSpouse(relative)
    }
    getNextKin(personA.longname, relation, cbRelative)
  }, [personA])

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
          router.push(`/personInfo/${kinB}`)
        } else {
          router.push(`/personInfo/${personA.longname}`)
        }
      } else {
        router.push(`/personInfo/${personA.longname}`)
      }
    } else {
      router.push(`/personInfo/${personA.longname}`)
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
