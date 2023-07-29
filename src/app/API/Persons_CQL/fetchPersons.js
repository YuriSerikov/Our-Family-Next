//import startSession from './startSession.js'
import neo4j from 'neo4j-driver'
import { bd_constants } from '../../Constants/bd_constants'

export default async function fetchPersons(callback) {
  //const session = startSession();
  const driver = neo4j.driver(bd_constants.bd_path, neo4j.auth.basic(bd_constants.bd_admin, bd_constants.bd_pass))
  const session = driver.session({
    database: bd_constants.bd_name,
    defaultAccessMode: neo4j.session.WRITE,
  })

  const matchAll =
    'MATCH (p:Person) RETURN  labels(p) AS labels, ' +
    'p.longName AS longname, p.lastname AS lastname, p.maidenname AS maidenname, ' +
    'p.name AS firstname, p.surname AS surname, p.birthday AS birthday, ' +
    'p.lastday AS lastday, p.birthplace AS birthplace, p.icon AS icon ORDER BY longname'

  //console.log('fetching from BD...');
  let recievedPersons = []
  let recievedPerson

  try {
    const result = await session.run(matchAll)
    const records = result.records

    for (let i = 0; i < records.length; i++) {
      recievedPerson = {
        labels: records[i].get('labels'),
        longname: records[i].get('longname'),
        lastname: records[i].get('lastname'),
        maidenname: records[i].get('maidenname'),
        firstname: records[i].get('firstname'),
        surname: records[i].get('surname'),
        birthday: records[i].get('birthday'),
        lastday: records[i].get('lastday'),
        birthplace: records[i].get('birthplace'),
        icon: records[i].get('icon'),
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
