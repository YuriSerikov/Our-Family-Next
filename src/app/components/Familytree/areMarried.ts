import { ISpouseType } from "../../models/spousesType";

function areMarried(spouses: ISpouseType[], longnameMan: string, longnameWoman: string) {
    let areMarried = false;
    let j = spouses.findIndex(elem => elem.wife === longnameWoman);
    let i = spouses.findIndex(elem => elem.husband === longnameMan);
    //console.log(i,j)
    if (j === -1) { return false }
    if (i === -1) { return false }
    
    if (j === i) {
        areMarried = true
    }
    return areMarried
}
export default areMarried