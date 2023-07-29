import neo4j from "neo4j-driver";
import { bd_constants } from "../../../Constants/bd_constants";

async function getIconsWithList(
    list: string,
    cbPassResult: (persons: { longname: string, minicard: string }[]) => void)
{
    const driver = neo4j.driver(
    bd_constants.bd_path,
    neo4j.auth.basic(bd_constants.bd_admin, bd_constants.bd_pass)
  );
  const session = driver.session({
    database: bd_constants.bd_name,
    defaultAccessMode: neo4j.session.WRITE,
  });
    
    const cql =
    `MATCH (p:Person) WHERE  p.longName IN ${list} ` +
    `RETURN DISTINCT p.longName as longname, p.minicard AS minicard`;
    //console.log('cql: ', cql)
     try {
    const result = await session.run(cql);
    const records = result.records;
    let recievedPerson;
    let recievedPersons = [];

    for (let i = 0; i < records.length; i++) {
      recievedPerson = {
        longname: records[i].get("longname"),
        minicard: records[i].get("minicard")
      };
      recievedPersons.push(recievedPerson);
    }
    cbPassResult(recievedPersons);
    //console.log(recievedPersons)
  } catch {
    console.error();
  } finally {
    session.close();
    driver.close();
  }
    
}
export default getIconsWithList