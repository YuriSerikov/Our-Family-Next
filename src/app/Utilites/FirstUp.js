 function FirstUp (strIn) {
    let strOut = '';
    if (strIn) {
        let str1 = strIn.trim();
        strOut = str1.substr(0, 1).toUpperCase() + str1.slice(1)
        
    }
    return strOut
}
export default FirstUp