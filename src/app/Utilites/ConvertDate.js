function ConvertDate (strIn) {
    let strOut = '';
    if (strIn) {
        let str1 = strIn.trim();
        strOut = str1.substr(0, 4)+ '-'+str1.substr(5, 2) +'-'+ str1.slice(8)
        
    }
    return strOut
}
export default ConvertDate
