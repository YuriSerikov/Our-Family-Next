import React, { useCallback, useEffect, useRef, useState } from 'react'
import TreeBuilding from './TreeBuilding'
import lineToDad from '../Relatives/lineToDad'
import lineToMom from '../Relatives/lineToMom'
import lineToWife from '../Relatives/lineToWife'
import { constRelTree } from '../Relatives/constRelTree'
import CanvasRelativesTree from '../Relatives/CanvasRelativesTree'
import LoaderLissajous from '../../UI/loaderLissajous/LoaderLissajous'
import stl from './bigFamilyTree.module.css'
import { IPersonCard } from '../../models/psnCardType'
import { IcouplesWithoutKids } from '../../models/couplesWithoutKidsType'
import { IReturnObj } from '../../models/returnObjType'

const BigFamilyTree = (props: { person: string; cbNewPerson: any }) => {

  const { person, cbNewPerson } = props
  const [isPersonsLoading, setIsPersonsLoading] = useState(true)
  const [arrIcons, setArrIcons] = useState<IPersonCard[]>([])
  const [kidlessCoupleCoords, setKidlessCoupleCoords] = useState<IcouplesWithoutKids[]>([])
  const pageWidthRef = useRef(1200)
  const gridstepX = constRelTree.miniWidth + constRelTree.marginCard

  const newActivePerson = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault()
    const longname = e.currentTarget.id
    if (longname && longname !== person) {
      setArrIcons([])
      cbNewPerson(longname)
    }
  }

  const cbRelArray = useCallback(
    (relatives: IReturnObj) => {
      setArrIcons(relatives.arrIcons)
      setIsPersonsLoading(relatives.loading)
      setKidlessCoupleCoords(relatives.arrCouplesWithoutKids)

      let maxPozx = 0
      if (relatives.arrIcons.length > 0) {
        for (let i = 0; i < relatives.arrIcons.length; i++) {
          if (relatives.arrIcons[i].pozX + gridstepX > maxPozx) {
            maxPozx = relatives.arrIcons[i].pozX + gridstepX
          }
        }
        pageWidthRef.current = maxPozx
      }
    },
    [gridstepX],
  )

  const createRelArr = useCallback(() => {
    TreeBuilding(person, cbRelArray)
  }, [cbRelArray, person])

  useEffect(() => {
    setIsPersonsLoading(true)
    setArrIcons([])
    setKidlessCoupleCoords([])

    createRelArr()
  }, [createRelArr])

  let pageHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight,
  )

  const DrawTree = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      let father: string | undefined = ''
      let mother: string | undefined  = ''
      let j = -1
      let k = -1

      // рисую сединение карточек детей и родителей

      if (arrIcons.length > 0) {
        ctx.lineWidth = 1
        ctx.setLineDash([])

        for (let i = 0; i < arrIcons.length; i++) {
          let minicard: IPersonCard = arrIcons[i]
          father = minicard.dad
          mother = minicard.mother

          if (minicard.level === 2 || minicard.level === 3) {
            // линия к матери
            k = -1

            if (!!mother) {
              k = arrIcons.findIndex((elem) => elem.longname === minicard.mother)
            }
            if (k > -1) {
              lineToMom(ctx, arrIcons[k].pozX, arrIcons[k].pozY, minicard.pozX, minicard.pozY, minicard.lineColor)
            }
            // линия к отцу

            j = -1
            if (!!father) {
              j = arrIcons.findIndex((elem) => elem.longname === minicard.dad)
            }
            if (j > -1) {
              lineToDad(ctx, arrIcons[j].pozX, arrIcons[j].pozY, minicard.pozX, minicard.pozY, minicard.lineColor)
            }
          }
          if (minicard.level > 3) {
            // линия к матери
            k = -1

            if (!!mother) {
              k = arrIcons.findIndex((elem) => elem.longname === minicard.mother)
            }
            if (k > -1) {
              lineToMom(ctx, arrIcons[k].pozX, arrIcons[k].pozY, minicard.pozX, minicard.pozY, minicard.lineColor)
            }
            // линия к отцу

            j = -1
            if (!!father) {
              j = arrIcons.findIndex((elem) => elem.longname === minicard.dad)
            }
            if (j > -1) {
              lineToDad(ctx, arrIcons[j].pozX, arrIcons[j].pozY, minicard.pozX, minicard.pozY, minicard.lineColor)
            }
          }
        }
      }
      // соединяем бездетных родителей
      if (kidlessCoupleCoords.length > 0) {
        for (let i = 0; i < kidlessCoupleCoords.length; i++) {
          lineToWife(
            ctx,
            kidlessCoupleCoords[i].xHusband,
            kidlessCoupleCoords[i].yHusband,
            kidlessCoupleCoords[i].xWife,
            kidlessCoupleCoords[i].yWife,
          )
        }
      }
    },
    [arrIcons, kidlessCoupleCoords],
  )

  return (
    <div>
      {isPersonsLoading ? (
        <>
          {' '}
          <LoaderLissajous />{' '}
        </>
      ) : (
        <CanvasRelativesTree DrawLines={DrawTree} width={pageWidthRef.current} height={pageHeight} />
      )}
      <div id={stl.minicard_container}>
        {arrIcons.map((icon, index) => (
          <div className={stl.icon_place} style={{ top: `${icon.pozY+15}px`, left: `${icon.pozX+15}px` }} key={index}>
            <img src={icon.minicard} id={icon.longname} onClick={newActivePerson} alt={`minicard_${index}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default BigFamilyTree
