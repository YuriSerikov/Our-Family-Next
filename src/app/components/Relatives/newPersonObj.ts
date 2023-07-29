function newPersonObj(level: number, longname: string, gender: string ,
    minicard: string, pozX:number, pozY: number, lineColor: string , dad?: string, mother?:string ) {
       
    return  {
        level: level,
        longname: longname,
        gender: gender,
        minicard: minicard,
        dad: dad,
        mother: mother,
        pozX: pozX,
        pozY: pozY,
        lineColor: lineColor,
    }
   
}
export default newPersonObj