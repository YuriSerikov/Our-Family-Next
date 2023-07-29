//import startSession from '../Persons_CQL/startSession'
import neo4j from "neo4j-driver";
import { bd_constants } from "../../Constants/bd_constants";

async function setPhotoProperties(
  photoFilename,
  photoTitle,
  photoCaption,
  passBackResult
) {
  let setProperties = "";
  const cql = `Match (p:Photo{filename:"${photoFilename}"}) set p.photoCaption="${photoCaption}" , p.photoTitle="${photoTitle}" return  id(p) AS id`;
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

    if (records.length > 0) {
      setProperties = "Информация записана";
    } else {
      setProperties = "Ничего не было сделано";
    }
    passBackResult(setProperties);
  } catch {
    console.error();
  } finally {
    session.close();
    driver.close();
  }
}

export default setPhotoProperties;
