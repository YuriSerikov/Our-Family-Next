//import startSession from '../startSession';
import neo4j from 'neo4j-driver'
import { bd_constants } from '../../../Constants/bd_constants'

async function getGrandChildren(longName, kins, passGrands) {
  const cql =
    `MATCH (p:Person {longName:'${longName}'})-[m:${kins}]->(r)-[q:${kins}]->(l) ` +
    `RETURN r.longName as child, type(q) as relationGrandChild, l.longName AS grandChild, ` +
    `labels(l) AS grandLabels, labels(r) AS parentLabels`

  if (!longName) {
    return
  }
  //const session = startSession();
  const driver = neo4j.driver(bd_constants.bd_path, neo4j.auth.basic(bd_constants.bd_admin, bd_constants.bd_pass))
  const session = driver.session({
    database: bd_constants.bd_name,
    defaultAccessMode: neo4j.session.WRITE,
  })

  try {
    const result = await session.run(cql)
    const records = result.records
    let recievedPerson
    let recievedPersons = []

    for (let i = 0; i < records.length; i++) {
      let genderChild = records[i].get('parentLabels')
      let genderGrandChild = records[i].get('grandLabels')

      recievedPerson = {
        id: i,
        longnameChild: records[i].get('child'),
        genderChild: genderChild[1],
        relationGrandChild: records[i].get('relationGrandChild'),
        longnameGrandChild: records[i].get('grandChild'),
        genderGrandChild: genderGrandChild[1],
      }
      recievedPersons.push(recievedPerson)
    }
    passGrands(recievedPersons)
    //console.log(recievedPersons)
  } catch {
    console.error()
  } finally {
    session.close()
    driver.close()
  }
}

export default getGrandChildren
