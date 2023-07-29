import { useEffect, useRef, useState, useCallback  } from 'react'
//import { useNavigate } from 'react-router-dom'
import { constRelTree } from './constRelTree'
import RelativesArray from './RelativesArray'
import CanvasRelativesTree from './CanvasRelativesTree'
import lineToMom from './lineToMom'
import lineToDad from './lineToDad'
import lineToWife from './lineToWife'
import LoaderLissajous from '../../UI/loaderLissajous/LoaderLissajous'
import stl from './PreviewCanvas.module.css'
import { IPersonCard } from '../../models/psnCardType'
import { IcouplesWithoutKids } from '../../models/couplesWithoutKidsType'
import { useRouter } from 'next/navigation'


const PreviewCanvas = (props: any) => {
  const { person, cbNewPerson } = props

  const [isPersonsLoading, setIsPersonsLoading] = useState(true)
  const [iconsRow, setIconsRow] = useState<IPersonCard[]>([])
  const [kidlessCoupleCoords, setKidlessCoupleCoords] = useState<IcouplesWithoutKids[]>([])
  const pageWidth = useRef(1200)
  const navigate = useRouter()
  const gridstepX = constRelTree.miniWidth + constRelTree.marginCard

  const gotoPersonForm = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault()
    const longname = e.currentTarget.id

    navigate.push(`/personInfo/${longname}`)
  }

  const newActivePerson = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault()
    const longname = e.currentTarget.id
    setIconsRow([])
    cbNewPerson(longname)
  }

  const createRelArr = useCallback(() => {
    const cbRelArray = (relatives: {
      arrIcons: IPersonCard[],
      loading: boolean,
      arrCouplesWithoutKids: IcouplesWithoutKids[]
    }) => {
      setIconsRow(relatives.arrIcons)
      setIsPersonsLoading(relatives.loading)
      setKidlessCoupleCoords(relatives.arrCouplesWithoutKids)
      if (relatives.arrIcons.length > 0) {
        let pozXmax = 0
        for (let i = 0; i < relatives.arrIcons.length; i++) {
          if (relatives.arrIcons[i].pozX + gridstepX > pozXmax) {
            pozXmax = relatives.arrIcons[i].pozX + gridstepX
          }
        }
        pageWidth.current = pozXmax
        
      }
    }

    RelativesArray(person, cbRelArray)
  }, [gridstepX, person])

  useEffect(() => {
    setIsPersonsLoading(true)
    setIconsRow([])
    setKidlessCoupleCoords([])

    createRelArr()
  }, [createRelArr])

  //let pageWidth = constRelTree.canvasWidth;
  //let pageWidth = document.documentElement.scrollWidth;
  //let pageHeight = document.documentElement.scrollHeight
  let pageHeight = document.documentElement.scrollHeight

  const DrawTree = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      let father: string | undefined = ''
      let mother: string | undefined = ''
      let j = -1
      let k = -1

      // рисую сединение карточек детей и родителей

      if (iconsRow.length > 0) {
        ctx.lineWidth = 1
        ctx.setLineDash([])

        for (let i = 0; i < iconsRow.length; i++) {
          let minicard = iconsRow[i]
          father = minicard.dad
          mother = minicard.mother

          if (minicard.level === 2 || minicard.level === 3) {
            // линия к матери
            k = -1

            if (!!mother) {
              k = iconsRow.findIndex((elem) => elem.longname === minicard.mother)
            }
            if (k > -1) {
              lineToMom(ctx, iconsRow[k].pozX, iconsRow[k].pozY, minicard.pozX, minicard.pozY, minicard.lineColor)
            }
            // линия к отцу

            j = -1
            if (!!father) {
              j = iconsRow.findIndex((elem) => elem.longname === minicard.dad)
            }
            if (j > -1) {
              lineToDad(ctx, iconsRow[j].pozX, iconsRow[j].pozY, minicard.pozX, minicard.pozY, minicard.lineColor)
            }
          }
          if (minicard.level > 3) {
            // линия к матери
            k = -1

            if (!!mother) {
              k = iconsRow.findIndex((elem) => elem.longname === minicard.mother)
            }
            if (k > -1) {
              lineToMom(ctx, iconsRow[k].pozX, iconsRow[k].pozY, minicard.pozX, minicard.pozY, minicard.lineColor)
            }
            // линия к отцу

            j = -1
            if (!!father) {
              j = iconsRow.findIndex((elem) => elem.longname === minicard.dad)
            }
            if (j > -1) {
              lineToDad(ctx, iconsRow[j].pozX, iconsRow[j].pozY, minicard.pozX, minicard.pozY, minicard.lineColor)
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
    [iconsRow, kidlessCoupleCoords],
  )

  return (
    <div>
      {isPersonsLoading ? (
        <>
          {' '}
          <LoaderLissajous />
          {' '}
        </>
      ) : (
        <CanvasRelativesTree DrawLines={DrawTree} width={pageWidth.current} height={pageHeight} />
      )}
      <div id="minicard_container">
        {iconsRow.map((iconRow, index) => (
          <div className={stl.icon_place} style={{ top: `${iconRow.pozY}px`, left: `${iconRow.pozX}px` }} key={index}>
            <img
              src={iconRow.minicard}
              id={iconRow.longname}
              onClick={gotoPersonForm}
              onDoubleClick={newActivePerson}
              alt={`minicard_${index}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PreviewCanvas
