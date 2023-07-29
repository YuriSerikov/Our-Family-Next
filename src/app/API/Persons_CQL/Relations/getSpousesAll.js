//import startSession from '../startSession';
import neo4j from "neo4j-driver";
import { bd_constants } from "../../../Constants/bd_constants";

async function getSpousesAll(relHusband, passSpouses) {
  const cql = `MATCH (p:Person)-[r:${relHusband}]->(w:Man) RETURN p.longName AS wife, w.longName AS husband`;
  //console.log(cql);

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
        longnameWife: records[i].get("wife"),
        longnameHusband: records[i].get("husband"),
      };
      recievedPersons.push(recievedPerson);
    }
    passSpouses(recievedPersons);
    //console.log(recievedPersons)
  } catch {
    console.error();
  } finally {
    session.close();
    driver.close();
  }
}

export default getSpousesAll;
