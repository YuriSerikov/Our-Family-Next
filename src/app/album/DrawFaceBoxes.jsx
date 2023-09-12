import { useCallback, useEffect, useState } from 'react'
import getFaceDetection from '@/app/API/PhotosWR/getFaceDetection'
import stl from './faceBox.module.css'

const DrawFaceBoxes = (props) => {
  const { photoFilename, w_ModalArea, h_ModalArea } = props

  const [show, setShow] = useState(false)
  const [photoDimentions, setPhotoDimentions] = useState({})
  const [faceBoxSizes, setFaceBoxSizes] = useState([])
  const [drawingData, setDrawingData] = useState([])
  const [photoNaturalWidth, setPhotoNaturalWidth] = useState()
  const [photoNaturalHeight, setPhotoNaturalHeight] = useState()

  const verifyScale = useCallback(() => {
    let dueScale = 0

    if (!h_ModalArea || !w_ModalArea || !photoNaturalHeight || !photoNaturalWidth) {
      // console.log('не получены данные для расчета коэф.сжатия')
      return dueScale
    }

    dueScale = h_ModalArea / photoNaturalHeight

    if (photoNaturalWidth * dueScale > w_ModalArea) {
      dueScale = w_ModalArea / photoNaturalWidth
    }

    if (photoNaturalHeight < h_ModalArea && photoNaturalWidth < w_ModalArea) {
      dueScale = 1
    }

    console.log('dueScale = ', dueScale)
    return dueScale
  }, [h_ModalArea, photoNaturalHeight, photoNaturalWidth, w_ModalArea])

  useEffect(() => {
    const area = document.getElementById('show_boxes_container')
    if (area) {
      if (photoFilename) {
        console.log('чтение из БД данных распознования')
        setFaceBoxSizes([])
        setDrawingData([])
        getFaceDetection(photoFilename, callbackDetectionData)
      }

      const scaleDue = verifyScale()

      if (!!w_ModalArea && !!h_ModalArea) {
        const hImg = photoNaturalHeight * scaleDue
        const wImg = photoNaturalWidth * scaleDue
        if (hImg >= h_ModalArea) {
          area.style.top = `0px`
        } else {
          const top = (h_ModalArea - hImg) / 2
          area.style.top = `${top}px`
        }

        area.style.width = `${wImg}px`
        area.style.height = `${hImg}px`
        area.style.left = `${(w_ModalArea - wImg) / 2}px`

        area.style.display = 'block'
      } else {
        area.style.display = 'none'
      }
    }
  }, [photoFilename, w_ModalArea, h_ModalArea, photoNaturalHeight, photoNaturalWidth, verifyScale])

  useEffect(() => {
    // коэфф. трансформации
    if (!!photoDimentions) {
      let transformFactor = h_ModalArea / photoDimentions.height
      // пересчет на размер окна, в котором произведено обнаружение лиц
      if (faceBoxSizes.length > 0) {
        let newBoxStyle = ''
        let divStyles = []

        for (let i = 0; i < faceBoxSizes.length; i++) {
          let x = Math.ceil(faceBoxSizes[i].face_x * transformFactor)
          let y = Math.ceil(faceBoxSizes[i].face_y * transformFactor)
          let w = Math.ceil(faceBoxSizes[i].face_width * transformFactor)
          let h = Math.ceil(faceBoxSizes[i].face_height * transformFactor)
          let title = faceBoxSizes[i].face_label

          newBoxStyle = {
            left: x,
            top: y,
            width: w,
            height: h,
            title: title,
          }

          //console.log(newBoxStyle);

          divStyles.push(newBoxStyle)
        }
        //console.log('box: ', drawingData);
        setDrawingData(divStyles)
        setShow(true)
      } else {
        setShow(false)
        setDrawingData([])
      }
    } else {
      setShow(false)
      setDrawingData([])
    }
  }, [faceBoxSizes, photoDimentions, h_ModalArea])

  const callbackDetectionData = (properties) => {
    let dim
    console.log('received from BD: ', properties)

    if (!!properties.faceBoxes) {
      dim = JSON.parse(properties.photoDisplaySize)
      setPhotoDimentions(dim)

      dim = JSON.parse(properties.faceBoxes)
      setFaceBoxSizes(dim)

      setPhotoNaturalWidth(properties.naturalWidth)

      setPhotoNaturalHeight(properties.naturalHeight)
    }
  }

  return (
    <>
      <div className={stl.show_boxes_container} id="show_boxes_container">
        {show ? (
          drawingData.map((item, index) => (
            <div
              className={stl.box_ext}
              key={'det' + index}
              style={{
                left: item.left + 'px',
                top: item.top + 'px',
              }}
            >
              <div
                className={stl.facebox}
                id={'facebox' + index}
                key={index}
                style={{
                  width: item.width + 'px',
                  height: item.height + 'px',
                }}
              ></div>
              <label htmlFor={'facebox' + index} className={stl.lbl_facebox} key={'label' + index}>
                {item.title}
              </label>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </>
  )
}

export default DrawFaceBoxes
