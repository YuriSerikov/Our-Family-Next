"use client"

import { Metadata } from "next"

import stl from '@/app/familyTree/familyTree.module.css'
import { useContext, useEffect, useState } from "react";
import {useRouter} from 'next/navigation';
import Button from "react-bootstrap/Button";
import { PersonContext } from "@/app/context/PersonContext";
import { PersonsListContext } from "../context/PersonsListContext";
//import getPersonsData from "@/app/API/Persons_CQL/Relations/getPersonsData";
import SelectPerson from "@/app/UI/selector/SelectPerson";
import PreviewCanvas from "@/app/components/Relatives/PreviewCanvas"
import { IPsnSelectList } from '@/app/models/psnSelectListType'
//import { IPerson } from "@/app/models/personType";

export const metadata: Metadata = {
  title: 'Tree | Our Family'
}

export default function FamilyTree() {

  const [activePerson, setActivePerson] = useState("");
  //const [personsData, setPersonsData] = useState<IPerson[]>([]);
  const [personsListFIO, setPersonsListFIO] = useState<IPsnSelectList[]>([]);
  const { personLongname } = useContext(PersonContext);
  const { personsList } = useContext(PersonsListContext);
  
  const router = useRouter()
  
  useEffect(() => {
    setPersonsListFIO(personsList);
  }, [personsList]);
  useEffect(() => {
    setActivePerson(personLongname)
  },[])

  const PassSelectedPerson = (selectedOption: IPsnSelectList) => {
    setActivePerson(selectedOption.label);
  };

  /* useMemo(() => {
    async function fetchData() {
      await getPersonsData((data: IPerson[]) => {
        setPersonsData(data);
      });
    }
    fetchData();
    setActivePerson(personLongname);
  }, [personLongname]); */

  const cbNewActivePerson = (person: string) => {
    setActivePerson(person);
  };


  const showRelatives = () => {
    router.push(`/familyTree/personRelatives/${activePerson}`)
  }
  
  const buildTheTree = () => {
    router.push(`/familyTree/personFamilyTree/${activePerson}`)
  };

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
    </>
  )
}