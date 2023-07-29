'use client'

import { useCallback, useEffect, useRef, useState, useContext } from 'react';
import { Metadata } from 'next';
import { usePersons } from '../Hooks/usePersons';
import { PersonContext } from '../context/PersonContext';
import { PersonsListContext } from "../context/PersonsListContext";
import fetchPersons from '../API/Persons_CQL/fetchPersons'
import LoaderLissajous from '../UI/loaderLissajous/LoaderLissajous'
import PersonList from '../components/PersonList/PersonList'
import AppSearch from "@/app/UI/psnFilter/AppInput"
import stl from './common.module.css'

export const metadata: Metadata = {
  title: 'All Persons | Our Family'
}

const CommonList = () => {

  const [persons, setPersons] = useState([]);
  const [isPersonsLoading, setIsPersonsLoading] = useState(false);
  const [visibleRowsAmount, setVisibleRowsAmount] = useState(9);
  const [filter, setFilter] = useState("");
  const personElemHeight = 56;
  const sortedAndSearchedPersons = usePersons(
      persons,
      filter
  );
  const totalPersonAmount = useRef(0);
  const { personLongname } = useContext(PersonContext);
  const { setPersonsList } = useContext(PersonsListContext);

    const createPersonsList = useCallback(
        (gotPersons: any) => {
        setPersons(gotPersons);
        setIsPersonsLoading(false);

        let arrTemp = [];
        for (let i = 0; i < gotPersons.length; i++) {
            arrTemp.push({
            value: i,
            label: gotPersons[i].longname,
            gender: gotPersons[i].labels[1],
            });
        }
        setPersonsList(arrTemp);
    },[]);

  const start = useCallback(() => {
    setIsPersonsLoading(true);
    
    fetchPersons( createPersonsList);
  }, [createPersonsList]);
  
  useEffect(() => {
    const windowInnerHeight =
      document.documentElement.clientHeight - 208;
    const rowsToShow = Math.trunc(windowInnerHeight / personElemHeight);
    setVisibleRowsAmount(rowsToShow);
  },[])

  useEffect(() => { 

    start();
  }, [start]);
    
    totalPersonAmount.current = sortedAndSearchedPersons.length;
    let lastNumber = totalPersonAmount.current % 10;
    let strChel =
    lastNumber === 2 || lastNumber === 3 || lastNumber === 4
      ? "человека"
      : "человек";

  return (
    <div>
      <div className={stl.areaSelect}>
          <AppSearch
            value={filter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFilter( e.target.value )}
            placeholder="Поиск ..."
          />
        </div>
      {isPersonsLoading ? (
          <div className={stl.personsLoading}>
            <LoaderLissajous />
          </div>
        ) : (
            <PersonList
                persons={sortedAndSearchedPersons}
                tytle={`Список персон: ${totalPersonAmount.current} ${strChel}.   Выбран: ${personLongname}`}
                rowHeight={personElemHeight}
                visibleRows={visibleRowsAmount}
                filter ={filter}
          />
        )}
    </div>
  );
};

export default CommonList;