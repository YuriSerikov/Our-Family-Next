import neo4j from "neo4j-driver";
import { bd_constants } from "../../Constants/bd_constants";

async function allFioPersonsInPictures(callback) {
  const driver = neo4j.driver(
    bd_constants.bd_path,
    neo4j.auth.basic(bd_constants.bd_admin, bd_constants.bd_pass)
  );
  const session = driver.session({
    database: bd_constants.bd_name,
    defaultAccessMode: neo4j.session.WRITE,
  });

  const cql =
    "MATCH (p:Person) -[IN_PICTURE]-(f:Photo) RETURN DISTINCT p.longName AS longname, labels(p)[1] AS gender ORDER by p.longName";

  let recievedPersons = [];
  let recievedPerson = "";

  try {
    const result = await session.run(cql);
    const records = result.records;

    for (let i = 0; i < records.length; i++) {
      recievedPerson = {
        value: i + 1,
        label: records[i].get("longname"),
        gender: records[i].get("gender"),
      };
      recievedPersons.push(recievedPerson);
    }

    callback(recievedPersons);
  } catch {
    console.error();
  } finally {
    session.close();
    driver.close();
  }
}
export default allFioPersonsInPictures;
