//import startSession from '../startSession';
import neo4j from "neo4j-driver";
import { bd_constants } from "../../../Constants/bd_constants";

async function getGrands(longName, kins, passGrands) {
  //const kins = '`ОТЕЦ`|`МАТЬ`';

  const cql =
    `MATCH (p:Person {longName:'${longName}'})-[m:${kins}]->(y:Person)-[k:${kins}]->(z:Person) ` +
    `RETURN DISTINCT y.longName as parent, type(k) as relationGrandParent, z.longName AS grandParent`;

  //console.log(cql);

  if (!longName) {
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
        longnameParent: records[i].get("parent"),
        relationGrand: records[i].get("relationGrandParent"),
        longnameGrand: records[i].get("grandParent"),
      };
      recievedPersons.push(recievedPerson);
    }
    passGrands(recievedPersons);
  } catch {
    console.error();
  } finally {
    session.close();
    driver.close();
  }
}

export default getGrands;
