import React, { useEffect, useState } from 'react';
//import checkRelation from './checkRelation'
import getRelCount from '../../API/Persons_CQL/Relations/getRelCount'
import getNoRelCount from '../../API/Persons_CQL/Relations/getNoRelCount';
import stl from './search4errors.module.css'

function Search4Errors () {
  
    const [errListNoRelatives, setErrListNoRelatives] = useState<{longname: string, count:number}[]>([])
    const [errListNotEven, setErrListNotEven] = useState<{longname: string, count:number}[]>([])
    
    // получить по запросу по всем Persons количестово связей с другими Persons
    // д.б. больше 0 и четным
    // если условие не выполнено, записать в выходную форму
    

    useEffect( () => {    
        const errReport = (resp: { count: number, longname: string }[]) => {
            setErrListNotEven(resp)
                   
        }

        const errReportNoRelatives = (resp: { count: number, longname: string }[]) => {
            setErrListNoRelatives(resp)
        }
   
        async function checkRelation(cbReport: any) {
            try {
                
                await getRelCount(cbReport)

            } catch (error) {
                console.error('Ошибка обращения к БД: ' + error)
                console.log('Ошибка при чтении из БД')
            }
        }
        async function checkNoRelation(cbReport: any) {
            try {
                
                await getNoRelCount(cbReport)

            } catch (error) {
                console.error('Ошибка обращения к БД: ' + error)
                console.log('Ошибка при чтении из БД')
            }
        }
        checkRelation(errReport)
        checkNoRelation(errReportNoRelatives)
      
    },[])
   
    return (
        <div className={stl.text_area}>
            {
                errListNoRelatives.map((resp) => (
                    <p key={resp.longname}>{resp.longname}: отношений - {resp.count.toString()} </p>
                ))
            }

            {
                errListNotEven.map((resp) => (
                    <p key={resp.longname}>{resp.longname}: отношений - {resp.count.toString()} </p>
                ))
            }
        </div>
    );
};

export default Search4Errors;