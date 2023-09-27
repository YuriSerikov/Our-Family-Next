import neo4j from 'neo4j-driver'
import { bd_constants } from '../../Constants/bd_constants'

async function getAmountPhoto(person, passBackResult, filter) {
  let amount = 0
  let cql
  if (!filter) {
    if (person) {
      cql = `MATCH (p:Photo)<-[:IN_PICTURE]-(n:Person {longName:'${person}'}) RETURN count(*) AS amount`
    } else {
      cql = `MATCH (p:Photo) RETURN count(*) AS amount`
    }
  } else {
    if (person) {
      cql = `MATCH (p:Photo)<-[:IN_PICTURE]-(n:Person {longName:'${person}'}) WHERE toLower(p.photoTitle) ${filter} RETURN count(*) AS amount`
    } else {
      cql = `MATCH (p:Photo) WHERE toLower(p.photoTitle) ${filter} RETURN count(*) AS amount`
    }
  }
  //console.log(cql)
  const driver = neo4j.driver(bd_constants.bd_path, neo4j.auth.basic(bd_constants.bd_admin, bd_constants.bd_pass))
  const session = driver.session({
    database: bd_constants.bd_name,
    defaultAccessMode: neo4j.session.WRITE,
  })

  try {
    const result = await session.run(cql)
    const records = result.records

    if (records.length > 0) {
      amount = records[0].get('amount')
    }

    passBackResult(amount)
  } catch (error) {
    console.error()
  } finally {
    session.close()
    driver.close()
  }
}
export default getAmountPhoto
