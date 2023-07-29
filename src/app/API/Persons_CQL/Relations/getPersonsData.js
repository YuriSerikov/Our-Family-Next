//import startSession from '../../Persons_CQL/startSession';
import neo4j from 'neo4j-driver'
import { bd_constants } from '../../../Constants/bd_constants'

async function getPersonsData(callback) {
  //const session = startSession();
  const driver = neo4j.driver(bd_constants.bd_path, neo4j.auth.basic(bd_constants.bd_admin, bd_constants.bd_pass))
  const session = driver.session({
    database: bd_constants.bd_name,
    defaultAccessMode: neo4j.session.WRITE,
  })

  const cql =
    `MATCH (p:Person) RETURN labels(p) AS labels, p.lastname AS lastname, ` +
    `p.maidenname AS maidenname, p.name AS firstname, p.surname AS surname, p.birthday AS birthday, ` +
    `p.lastday AS lastday, p.birthplace AS birthplace, p.icon AS icon, p.longName AS longname ` +
    `ORDER BY p.longName`

  let recievedPersons = []
  let recievedPerson = {}

  try {
    const result = await session.run(cql)
    const records = result.records

    for (let i = 0; i < records.length; i++) {
      //let labels = records[i].get('labels')
      recievedPerson = {
        id: i,
        labels: records[i].get('labels'),
        lastname: records[i].get('lastname'),
        maidenname: records[i].get('maidenname'),
        firstname: records[i].get('firstname'),
        surname: records[i].get('surname'),
        birthday: records[i].get('birthday'),
        lastday: records[i].get('lastday'),
        birthplace: records[i].get('birthplace'),
        icon: records[i].get('icon'),
        longname: records[i].get('longname'),
      }
      recievedPersons.push(recievedPerson)
    }

    callback(recievedPersons)
  } catch {
    console.error()
  } finally {
    session.close()
    driver.close()
  }
}

export default getPersonsData
