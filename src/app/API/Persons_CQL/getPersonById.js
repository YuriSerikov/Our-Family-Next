import neo4j from 'neo4j-driver'
//import startSession from './startSession.js'
import { bd_constants } from '../../Constants/bd_constants'

async function getPersonById(longname, callBacKPerson) {
  const matchPerson =
    `match (p:Person) where p.longName="${longname}" RETURN  labels(p) AS labels, id(p) AS id, ` +
    'p.longName AS longname, p.lastname AS lastname, p.maidenname AS maidenname, ' +
    'p.name AS firstname, p.surname AS surname, p.birthday AS birthday, p.minicard AS minicard, ' +
    'p.lastday AS lastday, p.birthplace AS birthplace, p.icon AS icon, p.job AS job, p.profile AS profile, p.alive AS alive'

  let recievedPerson
  //console.log(matchPerson)
  //const session = startSession();
  const driver = neo4j.driver(bd_constants.bd_path, neo4j.auth.basic(bd_constants.bd_admin, bd_constants.bd_pass))
  const session = driver.session({
    database: bd_constants.bd_name,
    defaultAccessMode: neo4j.session.WRITE,
  })

  try {
    const result = await session.run(matchPerson)
    const records = result.records

    recievedPerson = {
      id: records[0].get('id'),
      labels: records[0].get('labels'),
      longname: records[0].get('longname'),
      lastname: records[0].get('lastname'),
      maidenname: records[0].get('maidenname'),
      firstname: records[0].get('firstname'),
      surname: records[0].get('surname'),
      birthday: records[0].get('birthday'),
      lastday: records[0].get('lastday'),
      birthplace: records[0].get('birthplace'),
      icon: records[0].get('icon'),
      job: records[0].get('job'),
      profile: records[0].get('profile'),
      alive: records[0].get('alive'),
      minicard: records[0].get('minicard'),
    }

    callBacKPerson(recievedPerson)
  } catch {
    console.error()
  } finally {
    session.close()
    driver.close()
  }
}

export default getPersonById
