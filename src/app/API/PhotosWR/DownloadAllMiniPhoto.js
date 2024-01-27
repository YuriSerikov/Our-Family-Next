//import startSession from "../Persons_CQL/startSession";
import neo4j from 'neo4j-driver'
import { bd_constants } from '../../Constants/bd_constants'

async function DownloadAllMiniPhoto(person, skip, limit, callback, filter, reverseOrder) {
  //const session = startSession();
  const driver = neo4j.driver(bd_constants.bd_path, neo4j.auth.basic(bd_constants.bd_admin, bd_constants.bd_pass))
  const session = driver.session({
    database: bd_constants.bd_name,
    defaultAccessMode: neo4j.session.WRITE,
  })

  let recievedPhotos = []
  let recievedPhoto
  let cql = ''
  if (!filter) {
    if (person) {
      cql =
        `MATCH (n:Person {longName:"${person}"})--(p:Photo) ` +
        `RETURN id(p) AS id, p.avatar AS miniPhoto, p.avatarWidth AS miniPhotoWidth, ` +
        `p.avatarHeight AS miniPhotoHeight, p.filename AS filename ORDER BY p.photoTitle ${reverseOrder} SKIP ${skip} LIMIT ${limit}`
    } else {
      cql =
        `MATCH (p:Photo) return id(p) AS id, p.avatar AS miniPhoto, p.avatarWidth AS miniPhotoWidth, ` +
        `p.avatarHeight AS miniPhotoHeight, p.filename AS filename ORDER BY id(p) DESC SKIP ${skip} LIMIT ${limit}`
    }
  } else {
    if (person) {
      cql =
        `MATCH (n:Person {longName:"${person}"})--(p:Photo) ` +
        `WHERE toLower(p.photoTitle) ${filter}` +
        `RETURN id(p) AS id, p.avatar AS miniPhoto, p.avatarWidth AS miniPhotoWidth, ` +
        `p.avatarHeight AS miniPhotoHeight, p.filename AS filename ORDER BY p.photoTitle ${reverseOrder} SKIP ${skip} LIMIT ${limit}`
    } else {
      cql =
        `MATCH (p:Photo) WHERE toLower(p.photoTitle) ${filter} RETURN id(p) AS id, p.avatar AS miniPhoto, p.avatarWidth AS miniPhotoWidth, ` +
        `p.avatarHeight AS miniPhotoHeight, p.filename AS filename ORDER BY id(p) DESC SKIP ${skip} LIMIT ${limit}`
    }
  }

  try {
    const result = await session.run(cql)
    const records = result.records

    for (let i = 0; i < records.length; i++) {
      recievedPhoto = {
        id: records[i].get('id'),
        miniPhoto: records[i].get('miniPhoto'),
        miniPhotoWidth: records[i].get('miniPhotoWidth'),
        miniPhotoHeight: records[i].get('miniPhotoHeight'),
        filename: records[i].get('filename'),
        //facesInfo: records[i].get('facesInfo')
      }
      //console.log(recievedPhoto);
      recievedPhotos.push(recievedPhoto)
    }
    callback(recievedPhotos)
    //
  } catch {
    console.error()
  } finally {
    session.close()
    driver.close()
  }
}

export default DownloadAllMiniPhoto
