//import startSession from '../Persons_CQL/startSession'
import neo4j from "neo4j-driver";
import { bd_constants } from "../../Constants/bd_constants";

async function getPhotoProperties(photoFilename, passBackResult) {
  let recievedProperties;
  const cql =
    `Match (p:Photo{filename:"${photoFilename}"}) ` +
    `return p.photoCaption AS photoCaption, p.photoTitle AS  photoTitle`;
  //const session = startSession();
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

    if (records.length > 0) {
      recievedProperties = {
        photoCaption: records[0].get("photoCaption"),
        photoTitle: records[0].get("photoTitle"),
      };
    } else {
      recievedProperties = {
        photoCaption: "",
        photoTitle: "",
      };
    }
    passBackResult(recievedProperties);
  } catch {
    console.error();
  } finally {
    session.close();
    driver.close();
  }
}

export default getPhotoProperties;
