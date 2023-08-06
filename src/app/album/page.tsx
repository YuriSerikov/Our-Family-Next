"use client"

import { Metadata } from "next"
import stl from "./album.module.css";
import './style.css'
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import Lightbox from "react-18-image-lightbox";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import LoaderLissajous from "@/app/UI/loaderLissajous/LoaderLissajous";
import { IPsnSelectList } from '@/app/models/psnSelectListType'
import { IMiniPhoto } from "@/app/models/miniPhotosType";
import { PersonContext } from "@/app/context/PersonContext";
import SelectPerson from "@/app/UI/selector/SelectPerson";
import getAmountPhoto from "@/app/API/PhotosWR/getAmountPhoto";
import check2 from "@/images/bootstrap/check2-square.svg";
import getPhotoProperties from "@/app/API/PhotosWR/getPhotoProperties"
import DownloadAllMiniPhoto from "@/app/API/PhotosWR/DownloadAllMiniPhoto";
import allFioPersonsInPictures from '@/app/API/PhotosWR/allFioPersonsInPictures'
import MessageHook from "@/app/Hooks/MessageHook";
import ModalInfoInput from "@/app/components/ModalInfoInput/ModalInfoInput";
import Image from "next/image";


export const metadata: Metadata = {
  title: 'Album | Our Family'
}

export default function Album() {
  const [title, setTitle] = useState("Альбом:");
  const [activePerson, setActivePerson] = useState("");
  const [personsListFIO, setPersonsListFIO] = useState<IPsnSelectList[]>([]);
  const [isMiniPhotosLoaded, setIsMiniPhotosLoaded] = useState(false);
  const [miniPhotos, setMiniPhotos] = useState<IMiniPhoto[]>([]);
  const [isScrollDown, setIsScrollDown] = useState(true);
  const [curPhoto, setCurPhoto] = useState('');
  const [nextPhoto, setNextPhoto] = useState('');
  const [prevPhoto, setPrevPhoto] = useState<string>();
  const [message, setMessage] = useState("");
  const [imageTitle, setImageTitle] = useState("заголовок к фотографии");
  const [imageCaption, setimageCaption] = useState("подпись к фотографии");
  const [miniIndex, setMiniIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [skipN, setSkipN] = useState(0);
  const [photoAmount, setPhotoAmount] = useState<number>(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const scrollTopY = useRef(0);
  const activePhotoName = useRef<string | null>("");
  const cardRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const w_ModalArea = useRef(0);
  const h_ModalArea = useRef(0);

  const { personLongname } = useContext(PersonContext);
 
  const limitNew = 200;
  const limitAdd = 50;

  useEffect(() => {
    setActivePerson(personLongname);
  }, [personLongname]);

  useEffect(() => {
    allFioPersonsInPictures((personList: IPsnSelectList[]) => {
      setPersonsListFIO(personList);
      
    });
  }, []);
  
  const photosEnding = (lastDigit: string) => {
    let text = "";
    switch (lastDigit) {
      case '1':
        text = "фотография"
        break;
      case '2':
      case '3':
      case '4':
        text = "фотографии"
        break;
      
      default:
        text = "фотографий"
        break;
    }

    return text
  }

  const lastDigit = (amount: number) => {
    let strAmount = '0'
    let lastLetter = '0'
    if (amount) {
      strAmount = amount.toString(10)
      lastLetter = strAmount.charAt(strAmount.length -1)
    }
    return lastLetter
  }

  useEffect(() => {

    const cbAmountPhoto = (amount: number) => {
      setPhotoAmount(amount);
    };

    async function getAmountPhotoForPerson(person:string) {
      await getAmountPhoto(person, cbAmountPhoto);
    }

    getAmountPhotoForPerson(activePerson)
    
  }, [activePerson]);

  useEffect(() => {
    const end_digit = lastDigit(photoAmount)
    const text = photosEnding(end_digit)
    setTitle(`Альбом - ${activePerson}: ${photoAmount} ${text}`);

  },[activePerson, photoAmount])

  const PassSelectedPerson = (selectedOption: IPsnSelectList) => {
    setTitle("Альбом: " + selectedOption.label);
    setActivePerson(selectedOption.label);

  };

  const findPhotonameByCheck = () => {
    const allChecks = document.getElementsByClassName(stl.minibtn_choice) as HTMLCollectionOf<HTMLElement>
    let displayVal = "none";
    let photoFilename: string | null = "";
      for (let i = 0; i < allChecks.length; i++) {
        displayVal = allChecks[i].style.display        //= 'display: none'
        if (displayVal === "block") {
            const elemMini =allChecks[i].nextElementSibling;
            if (elemMini) {
                photoFilename = elemMini.getAttribute("alt");
            }
        }
      }
    return photoFilename;
  };

    const setTitleandCaption = (properties:{photoTitle: string, photoCaption: string}) => {
    setImageTitle(properties.photoTitle);
    setimageCaption(properties.photoCaption);
  };
  
  async function viewPhoto(photoFilename: string) {
    const curURL = "/api/photo/photos/" + photoFilename;
    let photosAmount = miniPhotos.length;

    await getPhotoProperties(photoFilename, setTitleandCaption);

    let curPoz = miniPhotos.findIndex(
      (elem) => elem.filename === photoFilename
    );

    if (curPoz < 0) {
      curPoz = 0;
    }
    setMiniIndex(curPoz);
    const nextPoz = (curPoz + 1) % photosAmount;
    const prevPoz = (curPoz + photosAmount - 1) % photosAmount;
    // загрузить 3 фото

    const nextURL: string = "/api/photo/photos/" + miniPhotos[nextPoz].filename;
    const prevURL: string = "/api/photo/photos/" + miniPhotos[prevPoz].filename;

    recievePhoto(curURL, setCurPhoto);
    setNextPhoto(nextURL);
    setPrevPhoto(prevURL);

    setIsOpen(true);
  };

  const handleScroll = (event: React.UIEvent) => {
    let curScrroll = event.currentTarget.scrollTop;
    if (curScrroll - scrollTopY.current >= 0) {
      setIsScrollDown(true);
    } else {
      setIsScrollDown(false);
    }
    scrollTopY.current = event.currentTarget.scrollTop;
  };

  const recievePhoto = (filename: string, callBack: any) => {
    // requestURL
    const requestURL = filename;
    const defaultRequestURL = '/photos/flowers.jpg'     //'/photos/flowers.jpg'
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64data = reader.result;
      callBack(base64data);
    };

    (async () => {

      try {
      const response = await fetch(requestURL);
      
        if (response.ok) {
          const imageBlob = await response.blob();
          reader.readAsDataURL(imageBlob);
        } else {
          setMessage("Не найдено фото! Статус: " + response.status);

          const resp = await fetch(defaultRequestURL);
          if (resp.ok) {
            const imageBlobDefault = await resp.blob();
            reader.readAsDataURL(imageBlobDefault);
          }
        }

      } catch (error) {
        console.error();
      }

    })();
  };

  const clickHandle = (e: React.MouseEvent) => {
    const elemMini = e.target as HTMLElement
    const check = elemMini.previousElementSibling as HTMLElement

    const allChecks = document.getElementsByClassName(stl.minibtn_choice) as HTMLCollectionOf<HTMLElement>
    for (let i = 0; i < allChecks.length; i++){
        allChecks[i].style.setProperty('display', 'none')
    }

    if (check) {
        check.style.setProperty('display', 'block')
       
      let photoName = findPhotonameByCheck();
      activePhotoName.current = photoName;

      const curURL = "/api/photo/photos/" + photoName;
       
      recievePhoto(curURL, setCurPhoto);
    }
  };

  const handleBtnShow = () => {
    //  начать слайд-шоу с активной фото

    let curFilename = activePhotoName.current
      ? activePhotoName.current
      : miniPhotos[0].filename;

    let curURL = "/api/photo/photos/" + curFilename;
    recievePhoto(curURL, setCurPhoto);

    viewPhoto(curFilename);
  };

  const clickDoubleHandle = (event: React.MouseEvent) => {
    event.preventDefault();
    const elemMini = event.currentTarget;
    const photoFilename = elemMini.getAttribute("alt");
    activePhotoName.current = photoFilename;

    handleBtnShow();
  };

  // загрузить ВСЕ миниатюры из БД
  const passMiniPhotos = useCallback((photos: IMiniPhoto[]) => {
    if (photos) {
      setMiniPhotos(photos);
      
      setSkipN(photos.length);
    }

    setIsMiniPhotosLoaded(true);
  }, []);

  useEffect(() => {
    const cbMiniPhotos = (photos: IMiniPhoto[]) => {
      setMiniPhotos(photos);
      setSkipN(photos.length);
      setIsMiniPhotosLoaded(true);
    };

    if (!activePerson) {
      DownloadAllMiniPhoto(null, 0, limitNew, cbMiniPhotos); //order by Id(p)
    }
  }, [activePerson]);

  // определить размер окна предпросмотра
    const getImgParams = () => {
    const elem_ViewArea = document.getElementsByClassName(
      "ril-inner ril__inner"
    );
    const elemView = elem_ViewArea.item(0);

    if (!elemView) {
      return;
    }
    const dim_ModalArea = elemView.getBoundingClientRect();
    w_ModalArea.current = dim_ModalArea.width;
    h_ModalArea.current = dim_ModalArea.height;
  };

  const onResize = useCallback(() => {
    if (!isOpen) {
      return;
    }
    getImgParams();
  }, [isOpen]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(onResize);
    const divElem = document.getElementById("lightbox") as HTMLElement
    resizeObserver.observe(divElem)
  }, [onResize]);

  const closeRequestHandler = () => {
    setIsOpen(false);
  };

  async function handleMovePrev() {
    let photosAmount = miniPhotos.length;
    const curPoz = (miniIndex + photosAmount - 1) % photosAmount;
    setMiniIndex(curPoz);

    //const elemMini = document.getElementById(curPoz);
    const photoFilename = miniPhotos[curPoz].filename;
    activePhotoName.current = photoFilename;
    await getPhotoProperties(photoFilename, setTitleandCaption);

    const nextPoz = (curPoz + 1) % photosAmount;
    const prevPoz = (curPoz + photosAmount - 1) % photosAmount;

    const curURL = "/api/photo/photos/" + miniPhotos[curPoz].filename;
    const nextURL = "/api/photo/photos/" + miniPhotos[nextPoz].filename;
    const prevURL = "/api/photo/photos/" + miniPhotos[prevPoz].filename;

    recievePhoto(curURL, setCurPhoto);
    setNextPhoto(nextURL);
    setPrevPhoto(prevURL);
  }

  async function handleMoveNext() {
    let photosAmount = miniPhotos.length;
    const curPoz = (miniIndex + 1) % photosAmount;
    setMiniIndex(curPoz);

    const photoFilename = miniPhotos[curPoz].filename;
    activePhotoName.current = photoFilename;
    await getPhotoProperties(photoFilename, setTitleandCaption);

    const nextPoz = (curPoz + 1) % photosAmount;
    const prevPoz = (curPoz + photosAmount - 1) % photosAmount;

    const curURL = "/api/photo/photos/" + miniPhotos[curPoz].filename;
    const nextURL = "/api/photo/photos/" + miniPhotos[nextPoz].filename;
    const prevURL = "/api/photo/photos/" + miniPhotos[prevPoz].filename;

    recievePhoto(curURL, setCurPhoto);
    setNextPhoto(nextURL);
    setPrevPhoto(prevURL);
  }

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const cbMessage = (messRez: string) => {
    setMessage(messRez);
  };

  async function selectBtnHandler() {
    setIsMiniPhotosLoaded(false);
    await DownloadAllMiniPhoto(activePerson, 0, limitNew, passMiniPhotos);
  }

  useEffect(() => {
    async function appendMiniPhotos(skip: number, limit: number) {
      const cbMiniPhotos = (photosGot: IMiniPhoto[]) => {
        let arrTemp = miniPhotos;

        // увеличить счетчик пропущенных записей
        setSkipN(skipN + photosGot.length);

        arrTemp = arrTemp.concat(photosGot);

        setMiniPhotos(arrTemp);
      };
      await DownloadAllMiniPhoto(activePerson, skip, limit, cbMiniPhotos);
    }

    const lastCardObserver = new IntersectionObserver(
      (entries) => {
        let lastcard = entries[entries.length - 1];

        if (!lastcard.isIntersecting) return;

        // увеличиваем счетчик уже загруженных миниатюр
        
        if (photoAmount > skipN) {
          appendMiniPhotos(skipN, limitAdd);
        }
        //console.log("the last card is shown");
        lastCardObserver.unobserve(lastcard.target);
      },
      { threshold: 0.15, rootMargin: "0px" }
    );

    let cards: any[] = [];
    let lastCardI = 0;

    if (isMiniPhotosLoaded) {
      cards = document.getElementsByClassName(stl.mini_photo) as HTMLCollectionOf<HTMLDivElement> | any
      lastCardI = cards.length - 1;

      if (isScrollDown) {
        lastCardObserver.observe(cards[lastCardI]);
      } else {
        lastCardObserver.unobserve(cards[lastCardI]);
      }
    }
  }, [
    activePerson,
    isMiniPhotosLoaded,
    isScrollDown,
    miniPhotos,
    photoAmount,
    skipN,
  ]);


  return (
    <>
      <p className={stl.album_header}>{title}</p>
      <div className={stl.album_container}>
        <div className={stl.personSelector_area}>
          <div className={stl.person_selector}>
            <SelectPerson
              isDisabled={false}
              optionlist={personsListFIO}
              passSelection={PassSelectedPerson}
            />
          </div>
        </div>
        <div className={stl.album_area}>
          <div
            className={stl.containerimages}
            id="album_view"
            onScroll={handleScroll}
            >
              {!isMiniPhotosLoaded ? (
                <div className={stl.personsLoading}>
                  <LoaderLissajous />
                </div>
              ) : (
                <>
                  <Container fluid>
                    {miniPhotos.map((miniPhoto, index) => (
                      <div className={stl.mini_photo} ref={cardRef} key={index}>
                        <Image
                          src={check2}
                          className={stl.minibtn_choice}
                          alt={miniPhoto.filename}
                          width={16}
                          height={16}
                        />

                        <Image
                          src={miniPhoto.miniPhoto}
                          onClick={(e) => clickHandle(e)}
                          onDoubleClick={(e) => clickDoubleHandle(e)}             
                          id={miniPhoto.filename}
                          alt={miniPhoto.filename}
                          key={miniPhoto.id}
                          width={150}
                          height={100}
                          style={{objectFit: 'contain'}}
                          
                        />
                      </div>
                    ))}
                  </Container>
                </>
              )}
              
          </div>
          <div className={stl.album_btn_area}>
             <Button
              variant="outline-primary"
              size="sm"
              className={stl.btn_action_mob}
              onClick={handleBtnShow}
            >
              Просмотр фото
            </Button>
            {"  "}
            <Button
              variant="outline-success"
              size="sm"
              className={stl.btn_action_mob}
              onClick={selectBtnHandler}
            >
              Отбор по персоне
            </Button>
          </div>
        </div>
        <div id="lightbox">
          {isOpen ? (
            <Lightbox
              mainSrc={curPhoto}
              nextSrc={nextPhoto}
              prevSrc={prevPhoto}
              onCloseRequest={closeRequestHandler}
              onMovePrevRequest={handleMovePrev}
              onMoveNextRequest={handleMoveNext}
              imagePadding={0}
              imageTitle={imageTitle}
              imageCaption={imageCaption}
              onImageLoad={getImgParams}
            />
          ) : (
            <></>
          )}
        </div>
        <div>
          <MessageHook page={"Альбом фотографий"} variant={"warning"}>
            {message}
          </MessageHook>
        </div>

        <div>
          <ModalInfoInput
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            photoName={activePhotoName}
            cbMessage={cbMessage}
          ></ModalInfoInput>
        </div>
      </div>
    </>
  )
}
