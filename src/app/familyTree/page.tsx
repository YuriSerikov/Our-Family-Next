"use client"

import { Metadata } from "next"

import stl from '@/app/familyTree/familyTree.module.css'
import { useContext, useEffect, useState } from "react";
import {useRouter} from 'next/navigation';
import Button from "react-bootstrap/Button";
import { PersonContext } from "@/app/context/PersonContext";
import { PersonsListContext } from "../context/PersonsListContext";
//import getPersonsData from "@/app/API/Persons_CQL/Relations/getPersonsData";
import Relatives4Person from '@/app/components/Relatives/Relatives4Person'
import LoaderLissajous from "@/app/UI/loaderLissajous/LoaderLissajous";
import Modal from "react-bootstrap/Modal";
import getPersonById from '@/app/API/Persons_CQL/getPersonById'
import SelectPerson from "@/app/UI/selector/SelectPerson";
import PreviewCanvas from "@/app/components/Relatives/PreviewCanvas"
import BigFamilyTree from '@/app/components/Familytree/BigFamilyTree'
import { IPsnSelectList } from '@/app/models/psnSelectListType'

import { IPerson } from "@/app/models/personType";

export const metadata: Metadata = {
  title: 'Tree | Our Family'
}

export default function FamilyTree() {

  const [activePerson, setActivePerson] = useState("");
  const [personsListFIO, setPersonsListFIO] = useState<IPsnSelectList[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalTree, setShowModalTree] = useState(false)
  const [isMan, setIsMan] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);
  const { personLongname } = useContext(PersonContext);
  const { personsList } = useContext(PersonsListContext);
  
  const router = useRouter()
  
  useEffect(() => {
    setPersonsListFIO(personsList);
  }, [personsList]);
  useEffect(() => {
    setActivePerson(personLongname)
  }, [])

  const passPersonData = (person: IPerson) => {
    if (person.labels[1] === "Man") {
      setIsMan(true);
    } else {
      setIsMan(false);
    }
    setIsLoaded(true);
  };
  // обЪект "Я"
  useEffect(() => {
    getPersonById(activePerson, passPersonData);
  }, [activePerson]);

  const PassSelectedPerson = (selectedOption: IPsnSelectList) => {
    setActivePerson(selectedOption.label);
  };

  const cbNewActivePerson = (person: string) => {
    setActivePerson(person);
  };

  const handleClose = () => setShowModal(false);
  const handleRelatives = () => setShowModal(true);
  const handleCloseTree = () => setShowModalTree(false);
  const buildTheTree = () => setShowModalTree(true);

  return (
    <>
      <h3 className={stl.tree_header}>Близкие родственники: {activePerson}</h3>
      <div className={stl.tree_container}>
          <div className={stl.personSelector}>
            <div className={stl.psn_selector}>
              <SelectPerson
                isDisabled={false}
                optionlist={personsListFIO}
                passSelection={PassSelectedPerson}
              />   
            </div>
          </div>
        
          <div className={stl.tree_area}>
            <div className={stl.tree_view_area} id="tree_view">
              <PreviewCanvas
                person={activePerson}
                cbNewPerson={cbNewActivePerson}
              />
            </div>
       
            <div className={stl.tree_btn_area}>
              <Button
                  variant="outline-primary"
                  size="sm"
                  className={stl.btn_action_mob}
                  onClick={buildTheTree}
                >
                  Построить дерево
              </Button>
                {"  "}
              <Button
                  variant="outline-success"
                  size="sm"
                  className={stl.btn_action_mob}
                  onClick={handleRelatives}
                >
                  Показать родственников
              </Button>
            </div>
          </div>
      </div>
      <div>
        <Modal size="lg" centered show={showModal} onHide={handleClose}>
          <Modal.Dialog>
            <Modal.Header closeButton>
              <Modal.Title>
                Родственники:{} {activePerson}
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
                      {activePerson}
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
      </div>
      <div>
        <Modal
          centered
          show={showModalTree}
          fullscreen={true}
          onHide={handleCloseTree}
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
      </div> 
    </>
  )
}