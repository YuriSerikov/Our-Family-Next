import neo4j from "neo4j-driver";
//import startSession from './startSession.js'
import { bd_constants } from "../../Constants/bd_constants";

async function getNextKin(longname, nextKin, callBacKPerson, label = "Person") {
  const matchPerson =
    `MATCH (p:${label} {longName:'${longname}'})-[:${nextKin}]->(n:Person) ` +
    `RETURN n.longName, n.minicard AS minicard, labels(n)[1] AS gender`;
  //console.log(nextKin,': ', matchPerson)

  if (!longname) {
    return;
  }
  const driver = neo4j.driver(
    bd_constants.bd_path,
    neo4j.auth.basic(bd_constants.bd_admin, bd_constants.bd_pass)
  );
  const session = driver.session({
    database: bd_constants.bd_name,
    defaultAccessMode: neo4j.session.WRITE,
  });
  //const session = startSession();

  try {
    const result = await session.run(matchPerson);
    const records = result.records;
    let recievedPerson;
    let recievedPersons = [];

    for (let i = 0; i < records.length; i++) {
      recievedPerson = {
        id: i,
        longname: records[i].get("n.longName"),
        minicard: records[i].get("minicard"),
        gender: records[i].get("gender"),
        relation: nextKin,
      };
      recievedPersons.push(recievedPerson);
    }

    callBacKPerson(recievedPersons);
  } catch {
    console.error();
  } finally {
    session.close();
    driver.close();
  }
  //console.log(recievedPerson);
}

export default getNextKin;
