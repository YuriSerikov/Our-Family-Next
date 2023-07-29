"use client"
import { IPerson } from "@/app/models/personType"
import { Metadata } from "next"
import Relatives4Person from '@/app/components/Relatives/Relatives4Person'
import LoaderLissajous from "@/app/UI/loaderLissajous/LoaderLissajous";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {useRouter} from 'next/navigation';
import { useEffect, useState } from "react";
import getPersonById from '@/app/API/Persons_CQL/getPersonById'

type Props = {
  params: {
    personLongname: string
  }
}
export const metadata: Metadata = {
  title: 'Person | Our Family'
}

export default function PersonRelatives({params:{personLongname}}: Props) { 

  const [person, setPerson] = useState<IPerson>()
  const [isMan, setIsMan] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter()
  const fullname = decodeURI(personLongname);

  const passPerson = (gotPerson: IPerson) => {
    setPerson(gotPerson)
    if (gotPerson.labels[1] === "Man") {
      setIsMan(true);
    } else {
      setIsMan(false);
    }
    setIsLoaded(true);
  };
  useEffect(() => {
    getPersonById(fullname, passPerson);
  },[])

  const handleClose = () => {
      router.push('/familyTree')
  }
  return (
    <>
      <Modal size="lg" centered show={true} onHide={handleClose}>
          <Modal.Dialog>
            <Modal.Header closeButton>
              <Modal.Title>
                Родственники:{} {fullname}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div>
                {!isLoaded ? (
                  <div>
                    <LoaderLissajous />
                  </div>
                ) : (
                  <div>
                    <Relatives4Person isMan={isMan}>
                      {fullname}
                    </Relatives4Person>
                  </div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                Закрыть окно
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal>
    </>
    )
}