"use client"

import { Metadata } from "next"

import stl from './familyTree.module.css'
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { lazy, Suspense } from 'react'
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { PersonContext } from "../context/PersonContext";
import { PersonsListContext } from "../context/PersonsListContext";
import getPersonById from '@/app/API/Persons_CQL/getPersonById'
import writePersonMinicard from '@/app/API/Persons_CQL/writePersonMinicard'
import getPersonsData from "@/app/API/Persons_CQL/Relations/getPersonsData";
import SelectPerson from "@/app/UI/selector/SelectPerson";
import LoaderLissajous from "@/app/UI/loaderLissajous/LoaderLissajous";
import BigFamilyTree from '@/app/components/Familytree/BigFamilyTree'
import PreviewCanvas from "@/app/components/Relatives/PreviewCanvas"
import AuthContext from "@/app/context/AuthContext";
import { IPsnSelectList } from '@/app/models/psnSelectListType'
import { IPerson } from "@/app/models/personType";

export const metadata: Metadata = {
  title: 'Tree | Our Family'
}

export default function FamilyTree() {

  const Relatives4Person = lazy(() => import('@/app/components/Relatives/Relatives4Person'))
  const [activePerson, setActivePerson] = useState("");
  const [isMan, setIsMan] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showErr, setShowErr] = useState(false);
  const [personsData, setPersonsData] = useState<IPerson[]>([]);
  const [putMinicards, setPutMinicards] = useState(false);
  const [showModalTree, setShowModalTree] = useState(false);
  const [personsListFIO, setPersonsListFIO] = useState<IPsnSelectList[]>([]);
  const createdMinicards = useRef([]) as React.MutableRefObject<string[]>
  const { personLongname } = useContext(PersonContext);
  const { personsList } = useContext(PersonsListContext);
  const [isReader, setIsReader] = useState(true);
  
  useEffect(() => {
    setPersonsListFIO(personsList);
  }, [personsList]);

  const PassSelectedPerson = (selectedOption: IPsnSelectList) => {
    setActivePerson(selectedOption.label);
  };

  const passPersonData = (person: IPerson) => {
    if (person.labels[1] === "Man") {
      setIsMan(true);
    } else {
      setIsMan(false);
    }
    setIsLoaded(true);
  };

  useEffect(() => {
    getPersonById(activePerson, passPersonData);
  }, [activePerson]);

  useMemo(() => {
    async function fetchData() {
      await getPersonsData((data: IPerson[]) => {
        setPersonsData(data);
      });
    }
    fetchData();
    setActivePerson(personLongname);
  }, [personLongname]);

  const cbNewActivePerson = (person: string) => {
    setActivePerson(person);
  };

  const buildTheTree = () => {
    setShowModalTree(true);
  };

  const showRelatives = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

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
                  onClick={showRelatives}
                >
                  Показать родственников
              </Button>
            </div>
          </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
      <div>
        <Modal
        centered
        show={showModalTree}
        fullscreen={true}
        onHide={() => setShowModalTree(false)}
      >
        <Modal.Header closeButton className={stl.modalTreeHeader}>
          <div className={stl.modalTreeTitle}>
            Семейное дерево: {activePerson}
          </div>
        </Modal.Header>
        <Modal.Body className={stl.modalBigTree}>
          <div>
            {!showModalTree ? (
              <div></div>
            ) : (
              <div>
                <BigFamilyTree
                  person={activePerson}
                  cbNewPerson={cbNewActivePerson}
                />
              </div>
            )}
          </div>
        </Modal.Body>
        </Modal>
      </div>
    </>
  )
}