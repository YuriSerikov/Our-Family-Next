//import startSession from './startSession.js'
import neo4j from "neo4j-driver";
import { bd_constants } from "../../Constants/bd_constants";

async function writePersonMinicard(personLongName, card, passResult) {
  //const session = startSession();
  const driver = neo4j.driver(
    bd_constants.bd_path,
    neo4j.auth.basic(bd_constants.bd_admin, bd_constants.bd_pass)
  );
  const session = driver.session({
    database: bd_constants.bd_name,
    defaultAccessMode: neo4j.session.WRITE,
  });

  const cql = `MATCH (p:Person {longName:'${personLongName}'}) SET p.minicard = '${card}' RETURN p.longName`;
  //console.log(cql)
  try {
    const result = await session.run(cql);
    const records = result.records;
    const longname = records[0].get("p.longName");
    passResult(longname);
  } catch {
    console.error();
    console.log("return with some error");
  } finally {
    session.close();
    driver.close();
  }
}

export default writePersonMinicard;
