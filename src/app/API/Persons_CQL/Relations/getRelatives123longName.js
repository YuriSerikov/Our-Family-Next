import neo4j from "neo4j-driver";
import { bd_constants } from "../../../Constants/bd_constants";
//import startSession from '../startSession';

async function getRelatives123(cql, passKins) {
  //console.log(cql);
  if (!cql) {
    return;
  }
  //const session = startSession();
  const driver = neo4j.driver(
    bd_constants.bd_path,
    neo4j.auth.basic(bd_constants.bd_admin, bd_constants.bd_pass)
  );
  const session = driver.session({
    database: bd_constants.bd_name,
    defaultAccessMode: neo4j.session.WRITE,
  });

  try {
    const result = await session.run(cql);
    const records = result.records;
    let recievedPerson;
    let recievedPersons = [];

    for (let i = 0; i < records.length; i++) {
      recievedPerson = {
        id: i,
        longname: records[i].get("longname"),
        gender: records[i].get("gender"),
      };
      recievedPersons.push(recievedPerson);
    }
    passKins(recievedPersons);
    //console.log(recievedPersons)
  } catch {
    console.error();
  } finally {
    session.close();
    driver.close();
  }
}

export default getRelatives123;
