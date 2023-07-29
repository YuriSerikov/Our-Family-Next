import neo4j from 'neo4j-driver'
import { bd_constants } from '../../../Constants/bd_constants'

async function getNoRelCount(cbRelation) {
  const cql = `MATCH (p:Person)-[r]-(n:Person) RETURN  p.longName AS longname, count(type(r)) AS relationsCount`
  //console.log('cql: ', cql)
  const driver = neo4j.driver(bd_constants.bd_path, neo4j.auth.basic(bd_constants.bd_admin, bd_constants.bd_pass))
  const session = driver.session({
    database: bd_constants.bd_name,
    defaultAccessMode: neo4j.session.WRITE,
  })

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

        resTemp.push({
          longname: relativeLongname,
          count: relationsCount,
        })
      }
      if (resTemp.length > 0) {
        resCheck = resTemp.filter((elem) => elem.count.toFixed === 0)
      }
      if (resCheck.length === 0) {
        resCheck.push({
          longname: 'Нет персон без отношений. Проверено записей ',
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

export default getNoRelCount
