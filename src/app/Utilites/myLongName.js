import FirstUp from "./FirstUp";

function myLongName(fName, lName, sName, mName, gender) {
    let strLongname = '';
    if (gender === 'Woman') {
        strLongname = (FirstUp (lName) + "(" + FirstUp(mName) + ") "+ FirstUp(fName) + " " + FirstUp(sName)).trim();
    } else {
        strLongname = (FirstUp (lName) + " " + FirstUp(fName) + " " + FirstUp(sName)).trim();
    }
    return strLongname
}

export default myLongName