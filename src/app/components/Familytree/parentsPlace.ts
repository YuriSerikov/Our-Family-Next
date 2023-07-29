import areMarried from "./areMarried";
import { ISpouseType } from '../../models/spousesType'

    // родители - место относительно сына/ дочери
const parentsPlace = (
    personGender: string = 'Man',
    longnameDad: string | undefined,
    longnameMom: string | undefined,
    xChild: number,
    stepX: number,
    deltaY: number,
    spouses: ISpouseType[]) => {
        
    // в разводе ?
    let theyAreMarried = true;
    let x_dad = xChild
    let x_mom = xChild

    if ((spouses.length > 0) && (longnameDad) && (longnameMom)) {
        theyAreMarried = areMarried(spouses, longnameDad, longnameMom)
    } else {
        theyAreMarried = true
    }
    
    if ((personGender === 'Man') && (theyAreMarried)) {
        // мать над персоной, отец - левее
        x_dad = xChild - stepX 
        x_mom = xChild
    } else if ((personGender === 'Woman') && (theyAreMarried)){
        // отец над персоной , мать - правее
        x_dad = xChild
        x_mom = xChild + stepX
    } else if ((personGender === 'Man') && (!theyAreMarried)) {
        // отец над персоной , мать - левее плюс зазор
        x_dad = xChild
        x_mom = xChild - stepX - deltaY / 2;
    } else if ((personGender === 'Woman') && (!theyAreMarried)){
        // мать над персоной плюс зазор и отец - правее плюс зазор
        x_dad = xChild + stepX + deltaY / 2;
        x_mom = xChild;
    }
    return {x_dad, x_mom}
}

export default parentsPlace