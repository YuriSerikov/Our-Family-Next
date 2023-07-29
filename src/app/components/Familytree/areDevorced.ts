import { IExspouseType } from '../../models/exsposesType'

const areDevorced = (exspouses: IExspouseType[], longnameMan: string, longnameWoman: string) => {
  let areDevorced = false
  let j = exspouses.findIndex((elem) => elem.ex_wife === longnameWoman)
  let i = exspouses.findIndex((elem) => elem.ex_husband === longnameMan)
  if (j === -1) {
    return false
  }
  if (i === -1) {
    return false
  }

  if (j === i) {
    areDevorced = true
  }

  return areDevorced
}
export default areDevorced