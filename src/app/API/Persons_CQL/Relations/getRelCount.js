import neo4j from 'neo4j-driver'
import { bd_constants } from '../../../Constants/bd_constants'

async function getRelCount(cbRelation) {
  const cql = `MATCH (p:Person)-[r]-(n:Person) RETURN  p.longName AS longname, count(type(r)) AS relationsCount`
  //console.log('cql: ', cql)
  const driver = neo4j.driver(bd_constants.bd_path, neo4j.auth.basic(bd_constants.bd_admin, bd_constants.bd_pass))
  const session = driver.session({
    database: bd_constants.bd_name,
    defaultAccessMode: neo4j.session.WRITE,
  })

  const isEven = (num) => {
    let numInt = Math.floor(num / 2)
    let numFrac = Math.ceil(num / 2 - numInt)
    let even = numFrac > 0 ? false : true
    return even
  }

  try {
    const result = await session.run(cql)
    const records = result.records
    let resCheck = []
    let relationsCount = 0
    let relativeLongname = ''
    let totalAmount = 0
    let resTemp = []

    if (records.length > 0) {
      totalAmount = records.length
      for (let i = 0; i < totalAmount; i++) {
        relationsCount = records[i].get('relationsCount')
        relativeLongname = records[i].get('longname')
        //console.log(relativeLongname, relationsCount)

        resTemp.push({
          longname: relativeLongname,
          count: relationsCount,
        })
      }
      if (resTemp.length > 0) {
        resCheck = resTemp.filter((elem) => !isEven(elem.count.toFixed))
        //resCheck = resCheck.concat(resTemp)
      }
      if (resCheck.length === 0) {
        resCheck.push({
          longname: 'Нет ошибок четности отношений. Проверено записей ',
          count: totalAmount,
        })
      }
    } else {
      resCheck.push({
        longname: 'Не получены записи из БД',
        count: 0,
      })
    }

    //console.log(resCheck)
    cbRelation(resCheck)
  } catch {
    console.error()
  } finally {
    session.close()
    driver.close()
  }
}

export default getRelCount
