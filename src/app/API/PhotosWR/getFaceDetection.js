//import startSession from '../Persons_CQL/startSession';
import neo4j from "neo4j-driver";
import { bd_constants } from "../../Constants/bd_constants";

async function getFaceDetection(photoFilename, passBackResult) {
  let recievedProperties;
  const cql =
    `MATCH (p:Photo {filename:"${photoFilename}"}) RETURN p.canvasDim AS displaySize, p.facesInfo AS facesData, ` +
    `p.naturalWidth AS naturalWidth, p.naturalHeight AS naturalHeight`;

  //console.log(cql);

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
    //console.log(records);

    if (records.length > 0) {
      recievedProperties = {
        photoDisplaySize: records[0].get("displaySize"),
        faceBoxes: records[0].get("facesData"),
        naturalWidth: records[0].get("naturalWidth"),
        naturalHeight: records[0].get("naturalHeight"),
      };
    } else {
      recievedProperties = {
        photoDisplaySize: "",
        faceBoxes: "",
      };
    }
    passBackResult(recievedProperties);
  } catch (err) {
    console.error("Error from request:", err);
    console.log("ошибка CQL getFaceDetection: " + err);
  } finally {
    session.close();
    driver.close();
  }
}
export default getFaceDetection;
