import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { IPerson } from '../../models/personType';
import stl from './personList.module.css'
import PersonItem from './PersonItem';
 

const PersonList = ({...props}) => {
    
  const {persons, tytle, rowHeight, visibleRows} = props    //, allPersons , filter
  const LIMIT = visibleRows;
   
  const [personsToSow, setPersonsToShow] = useState<IPerson[]>(persons.slice(0, LIMIT))
  const [hasMore, setHasMore] = useState(true);
  const [visible, setVisible] = useState(LIMIT);

  useEffect(() => {
    setPersonsToShow(persons.slice(0, LIMIT))

  },[LIMIT, persons])
    
  
    
  if (!persons.length) {
    return <p className={stl.header4}> Список пустой!</p>;
  }

  
  const fetchData = () => {
    const newLimit = visible + LIMIT;
    const dataToAdd = persons.slice(visible, newLimit)

        if (persons.length > personsToSow.length) {
            setPersonsToShow( [...personsToSow].concat(dataToAdd))
            setVisible(newLimit);
        } else {
            setHasMore(false);
        }
  };

  return (
    <div className={stl.areaHeaderAnaList}>
      <p className={stl.header4}>{tytle}</p>
      <div className={stl.areaPsnList}>
        <InfiniteScroll
          dataLength={personsToSow.length}
          next={fetchData}
          hasMore={hasMore}
          loader={<p>Идет загрузка...</p>}
          height={rowHeight * visibleRows + 4}
          style= {{overflow: 'scroll'}}
          endMessage={<p>Достигнут конец списка</p>}
        >
          {personsToSow.map((person: IPerson, index: number) => (
              <PersonItem
                rowNumber={index + 1}
                person={person}
                key={person.longname}
              />
            )
          )}
        </InfiniteScroll>
      </div>
      
    </div>
  )
};

export default PersonList;