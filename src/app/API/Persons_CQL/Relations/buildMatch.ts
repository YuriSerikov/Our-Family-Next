import { relConst } from "./relConst";

const buildMatch = (personLongName:string, relKind:string, returnCase:string):string => {
    let cql = '';
    const rDM = relConst.relationDadOrMom;
    const rSD = relConst.relationSunOrDaughter;
    const rw = relConst.relationWife;
    const rh = relConst.relationHusband;
    const rwh = relConst.relationSpouse;
    let r4 = relConst.relationExWife;
    
    if (!(personLongName)) {
        console.log('CQL запрос не сформирован. Отсутствует полное имя человека.')
        return ''
    }
    
    switch (relKind) {
        case 'ex_wife':                     // бывшая жена
            r4 = relConst.relationExWife;
            cql = `MATCH (y:Man {longName:'${personLongName}'})-[k:${r4}]->(z:Person) `
                
            break;
        case 'ex_husband':                   // бывший муж
            r4 = relConst.relationExHusband
            cql = `MATCH (y:Woman {longName:'${personLongName}'})-[k:${r4}]->(z:Person) `
                
            break;
        case 'wife':                        // жена
            cql = `MATCH (y:Man {longName:'${personLongName}'})-[k:${rw}]->(z:Person) `
                
            break;
        case 'husband':                      // муж
            cql = `MATCH (y:Woman {longName:'${personLongName}'})-[k:${rh}]->(z:Person) `
                
            break;
        case 'parents':                     // родители
            cql = `MATCH (y:Person {longName:'${personLongName}'})-[k:${rDM}]->(z:Person) `

            break;
        case 'GreatGrandParents':       // прадедушки и прабабушки
            cql = `MATCH (p:Person {longName:'${personLongName}'})-[r:${rDM}]->(x:Person) ` +
                `-[q:${rDM}]->(y:Person)-[k:${rDM}]->(z:Person) `
            
            break;
        case 'Brothers':                // братья и сестры
            cql = `MATCH (p:Person {longName: '${personLongName}'})-[r:${rDM}]->(y:Person)-[k:${rSD}]->(z:Person) ` +
                `WHERE z.longName<>p.longName `
            
            break;
        case 'Uncles':                  // дяди и тети
            cql = `MATCH (p:Person {longName:'${personLongName}'})-[r:${rDM}]->(x:Person)` +
                `-[q:${rDM}]->(y:Person)-[k:${rSD}]->(z:Person) ` +
                `WHERE x.longName<>z.longName `
            
            break;
        case 'Cousins':                 // племянники и племянницы
            cql = `MATCH (p:Person {longName:'${personLongName}'})-[r:${rDM}]->(x:Person)` +
                `-[q:${rSD}]->(y:Person)-[k:${rSD}]->(z:Person) ` +
                `WHERE y.longName<>p.longName `
                
            break;
        case 'WifeParents':             // тесть и теща
            cql = `MATCH (p:Person {longName: '${personLongName}'})-[r:${rw}]->(y:Person)-[k:${rDM}]->(z:Person) ` +
                `WHERE z.longName<>p.longName `
                
            break;
        case 'HusbandParents':        //  свекр и свекровь
            cql = `MATCH (p:Person {longName: '${personLongName}'})-[r:${rh}]->(y:Person)-[k:${rDM}]->(z:Person) ` +
                `WHERE z.longName<>p.longName `
            break;
        case 'WifeBrother':             // Шурины и своячницы
            cql = `MATCH (p:Person {longName:'${personLongName}'})-[r:${rw}]->(x:Person) ` +
                `-[q:${rDM}]->(y:Person)-[k:${rSD}]->(z:Person) ` +
                `WHERE z.longName<>x.longName `
               
            break;
        case 'HusbandBrother':          // Девери и золовки
            cql = `MATCH (p:Person {longName:'${personLongName}'})-[r:${rh}]->(x:Person)` +
                `-[q:${rDM}]->(y:Person)-[k:${rSD}]->(z:Person) ` +
                `WHERE z.longName<>x.longName ` 
            
            break;
        case 'secondBrothers':            // Двоюродные братья и сестры
            cql = `MATCH (p:Person {longName:'${personLongName}'})-[r:${rDM}]->(c:Person)-[q:${rDM}]->(x:Person) ` +
                `-[h:${rSD}]->(y:Person)-[k:${rSD}]->(z:Person) ` +
                `WHERE c.longName<>y.longName `
                
            break;
        case 'greatUncle':                  // двоюродные дедушки и бабушки
            cql = `MATCH (p:Person {longName:'${personLongName}'})-[r:${rDM}]->(c:Person)-[q:${rDM}]->(x:Person)` +
                `-[h:${rDM}]->(y:Person)-[k:${rSD}]->(z:Person) ` +
                `WHERE z.longName<>x.longName `
            break;
        case 'secondCousins':              // двоюродные племянники и племянницы
            cql = `MATCH (p:Person {longName:'${personLongName}'})-[r:${rDM}]->(c:Person)-[q:${rDM}]->(x:Person)` +
                `-[h:${rSD}]->(n:Person)-[l:${rSD}]->(y:Person)-[k:${rSD}]->(z:Person) ` +
                `WHERE p.longName<>y.longName AND c.longName<>n.longName `
            
            break;
        case 'greatCousins':              // внучатые племянники и племянницы
            cql = `MATCH (p:Person {longName:'${personLongName}'})` +
                `-[r:${rDM}]->(c:Person)-[q:${rSD}]->(x:Person)-[h:${rSD}]->(y:Person)-[k:${rSD}]->(z:Person) ` +
                `WHERE p.longName<>x.longName `
            
            break;
        case 'secondUncle':                 // двоюродный дядя или тетя
            cql = `MATCH (p:Person {longName:'${personLongName}'})-[r:${rDM}]->(c:Person)-[q:${rDM}]->(x:Person)` +
                `-[h:${rDM}]->(n:Person)-[l:${rSD}]->(y:Person)-[k:${rSD}]->(z:Person) ` +
                `WHERE x.longName<>y.longName `
                
            break;
        case 'thirdBrother':                // троюродный брат или сестра
            cql = `MATCH (p:Person {longName:'${personLongName}'})-[r:${rDM}]->(a:Person)-[q:${rDM}]->(b:Person)` +
                `-[h:${rDM}]->(c:Person)-[k1:${rSD}]->(n:Person)-[l:${rSD}]->(y:Person)-[k:${rSD}]->(z:Person) ` +
                `WHERE a.longName<>y.longName AND p.longName<>z.longName AND n.longName<>b.longName `
                 
            break;
        case 'svat':                        // сват и сватья
            cql = `MATCH (p:Person {longName:'${personLongName}'})` +
                `-[r:${rSD}]->(a:Person)-[q:${rwh}]->(y:Person)-[k:${rDM}]->(z:Person) `+
                `WHERE p.longName<>z.longName `
            
            break;
        
        case 'kids':                        // дети
            cql = `MATCH (p:Person {longName:'${personLongName}'})-[r:${rSD}]->(y:Person)<-[k:${rSD}]-(z:Person) ` +
                `WHERE p.longName<>z.longName `
            break;
        default:
            cql = ''
            break;
    }
    let cqlReturn = '';

    switch (returnCase) {
        case 'card':
            cqlReturn = `RETURN DISTINCT y.longName as longnamePred, labels(y)[1] AS labelsPred, ` +
                `type(k) as relation, z.longName AS longname, labels(z)[1] AS labels, z.minicard as minicard`;
            break;
        
        case 'longName':
            cqlReturn = `RETURN DISTINCT z.longName AS longname, labels(z)[1] AS gender`;
            break;
        
        case 'no DISTINCT':
            cqlReturn = `RETURN type(k) as relation, z.longName AS longname, labels(z)[1] AS labels, z.minicard as minicard`;
            break;
        
        default:
            cqlReturn = 'RETURN'
            break;
    }


    return cql + cqlReturn;
    
}

export default buildMatch