'use client'
import { Metadata } from "next"

import stl from '@/app/familyTree/familyTree.module.css'
import { useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import BigFamilyTree from '@/app/components/Familytree/BigFamilyTree'
import LoaderLissajous from "@/app/UI/loaderLissajous/LoaderLissajous";
import { useRouter } from 'next/navigation';
import { IPerson } from "@/app/models/personType"
import getPersonById from '@/app/API/Persons_CQL/getPersonById'

export const metadata: Metadata = {
  title: 'Family Tree | Our Family'
}
type Props = {
  params: {
    treePerson: string
  }
}

export default function  PersonBigTree({params:{treePerson}}: Props) {

  const [showModalTree, setShowModalTree] = useState(false);
  const [activePerson, setActivePerson] = useState('');
  //const [isLoaded, setIsLoaded] = useState(false);

  const router = useRouter()
  const fullname = decodeURI(treePerson);

  const cbNewActivePerson = (person: string) => {
    setActivePerson(person);
  };

  const passPerson = (gotPerson: IPerson) => {
    setActivePerson(gotPerson.longname)
    
    setShowModalTree(true);
  };
  useEffect(() => {
    getPersonById(fullname, passPerson);
  },[])

  const handleClose = () => {
      //setShowModalTree(false)
      router.push('/familyTree')
  }

  return (
    <>
      <Modal
        centered
        show={true}
        fullscreen={true}
        onHide={() => handleClose()}
      >
        <Modal.Header closeButton className={stl.modalTreeHeader}>
          <div className={stl.modalTreeTitle}>
            Семейное дерево: {activePerson}
          </div>
        </Modal.Header>
        <Modal.Body className={stl.modalBigTree}>
          
            {!showModalTree ? (
              <div>
                <LoaderLissajous />
              </div>
            ) : (
              <div>
                <BigFamilyTree
                  person={activePerson}
                  cbNewPerson={cbNewActivePerson}
                />
              </div>
            )}
          
        </Modal.Body>
      </Modal>
      
    </>
  );
};
