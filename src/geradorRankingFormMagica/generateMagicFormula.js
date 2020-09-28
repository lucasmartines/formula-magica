const gerador = require("./magicAlg.js")
const fs = require("fs")




gerador.getDataFromWeb(  (listAcoes) => 
{

    console.log( process.argv[2] )

    let destiny = __dirname + '/../public/json/acoes_magic.json'
    fs.writeFileSync( process.argv[2] || destiny , JSON.stringify( listAcoes , undefined , 2));
    
    console.log("Segue uma parte" , listAcoes.slice(0,5)) ;
})