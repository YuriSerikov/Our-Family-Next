import stl from './PreviewArea.module.css'
import FormatBytes from '@/app/Utilites/FormatBytes'
import x_circle from '@/images/bootstrap/x-circle.svg'
import Image from 'next/image'

const PreviewArea = (props) => {
  const { imgToShow, filename, filesize, removeHandler } = props

  return (
    <div className={stl.card}>
      <div className={stl.preview}>
        <div className={stl.previewImage}>
          <div className={stl.previewremove} id="previewremove">
            <Image src={x_circle} className={stl.minibtn_remove} alt="remove" onClick={removeHandler} />
          </div>
          {imgToShow && (
            <Image
              src={imgToShow}
              width={256}
              height={256}
              className={stl.previewImageImg}
              id={filename}
              alt={filename}
            />
          )}

          <div className={stl.previewInfo}>
            <span>{filename}</span>
            <span>: </span>
            {FormatBytes(filesize)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewArea
