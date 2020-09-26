const gerador = require("./index.js")
const fs = require("fs")




gerador.getDataFromWeb(  (listAcoes) => 
{

    console.log( process.argv[2] )

    fs.writeFileSync( process.argv[2] || 'market.json', JSON.stringify( listAcoes , undefined , 2));
    
    console.log("Segue uma parte" , listAcoes.slice(0,5)) ;
})