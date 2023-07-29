import neo4j from 'neo4j-driver'
import { bd_constants } from '../../../Constants/bd_constants'
//import startSession from '../startSession';

async function getRelatives123(curPerson, relMomDad, passKins) {
  const driver = neo4j.driver(bd_constants.bd_path, neo4j.auth.basic(bd_constants.bd_admin, bd_constants.bd_pass))
  const session = driver.session({
    database: bd_constants.bd_name,
    defaultAccessMode: neo4j.session.WRITE,
  })

  const cql =
    `MATCH (p:Person)-[*1..6]->(n:Person{longName:'${curPerson}'}) ` +
    `OPTIONAL MATCH (p)-[r:${relMomDad}]->(z:Person) ` +
    `RETURN DISTINCT p.longName as longname, type(r) as relation, z.longName AS parent, labels(p)[1] AS gender` //, p.minicard AS minicard
  //console.log('cql: ', cql)

  try {
    const result = await session.run(cql)
    const records = result.records
    let recievedPerson
    let recievedPersons = []

    for (let i = 0; i < records.length; i++) {
      recievedPerson = {
        parent: records[i].get('parent'),
        relation: records[i].get('relation'),
        longname: records[i].get('longname'),
        gender: records[i].get('gender'),
        minicard: '', //records[i].get('minicard'),
      }
      recievedPersons.push(recievedPerson)
    }
    passKins(recievedPersons)
    //console.log(recievedPersons)
  } catch {
    console.error()
  } finally {
    session.close()
    driver.close()
  }
}

export default getRelatives123
