function ConvertDateFormat(strDate) {
    let formatedDate = '';
    if (strDate) {
        formatedDate =strDate.substr(0, 4)  + '.' + strDate.substr(5, 2) + '.' + strDate.substr(8, 2);
    }  
    return formatedDate;
}
export default ConvertDateFormat