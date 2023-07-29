//import startSession from '../startSession';
import neo4j from "neo4j-driver";
import { bd_constants } from "../../../Constants/bd_constants";

async function getGreatGrandChildren(longName, kins, passGrands) {
  const cql =
    `MATCH (p:Person {longName:'${longName}'})-[m:${kins}]->(r)-[q:${kins}]->(l)-[h:${kins}]->(z) ` +
    `RETURN  type(q) AS relationGrandChild, l.longName as grandChild, type(h) as relationGreatGrandChild, ` +
    `z.longName AS greatGrandChild, labels(l) AS grandChildLabels, labels(z) AS greatGrandChildLabels`;
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
      let genderGrandChild = records[i].get("grandChildLabels");
      let genderGreatGrandChild = records[i].get("greatGrandChildLabels");

      recievedPerson = {
        id: i,
        relationChild: records[i].get("relationGrandChild"),
        longnameChild: records[i].get("grandChild"),
        genderChild: genderGrandChild[1],
        relationGrandChild: records[i].get("relationGreatGrandChild"),
        longnameGrandChild: records[i].get("greatGrandChild"),
        genderGrandChild: genderGreatGrandChild[1],
      };
      recievedPersons.push(recievedPerson);
    }
    passGrands(recievedPersons);
    //console.log(recievedPersons)
  } catch {
    console.error();
  } finally {
    session.close();
    driver.close();
  }
}

export default getGreatGrandChildren;
