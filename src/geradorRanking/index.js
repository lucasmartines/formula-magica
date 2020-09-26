var Crawler = require("crawler");
var $ = require("cheerio")
let data = require("./config")




function filterToFloat(number) {
  let temp = number.replace(".","").replace(",", ".").replace("%", "");

  if( isNaN ( +temp ) ) {
    return 0
  }else{
    return +temp 
  }
}

function getDataFromHtmlTableRow(ativoTR) {

  let TDhtmlChildren  = $(ativoTR).children();

  let cotacao    = filterToFloat ($(TDhtmlChildren[1]).text());
  let pl         = filterToFloat ($(TDhtmlChildren[2]).text() );
  let nome       = $(TDhtmlChildren[0]).text()
  let ev_Ebit    = filterToFloat($(TDhtmlChildren[10]).text())
  let pVpa       = filterToFloat($(TDhtmlChildren[3]).text())


  let liquidacaoBimestral = filterToFloat ( $(TDhtmlChildren[17] ).text() )
  let patrimonioLiquido =  $(TDhtmlChildren[18] ).text() 
 
  let roicAmount =    filterToFloat($(TDhtmlChildren[15]).text())
  let divLiq_PatrLiq =filterToFloat($(TDhtmlChildren[19]).text())


  return { nome ,  cotacao, pl  , ev_Ebit,  roicAmount,
             divLiq_PatrLiq,  liquidacaoBimestral, patrimonioLiquido , pVpa }
}

// greater go to down
function sortEvEbit ( a , b )  {
  if( a.ev_Ebit == b.ev_Ebit )  return 0
  return ( a.ev_Ebit > b.ev_Ebit ) ? 1 : -1 
}

// greater go to up
function sortByRoic ( a , b )  {
  if( a.roicAmount == b.roicAmount )  return 0
  return ( a.roicAmount > b.roicAmount ) ? -1 : 1 
}

// greater go to down
// tendo em mente que as ações mais promissoras são as primeiras 
// então as com numeros grandes são as ultimas, empurre elas para baixo
function sortEarningYield ( a , b )  {
 
  if( a.earningYield  ==  b.earningYield )  return 0
  return ( a.earningYield > b.earningYield ) ? 1 : -1 
}

function ranquearPorRoic(listAcoes){

  listAcoes.sort( sortByRoic )
      
  for( i = 0 ; i < listAcoes.length ; i++){
    if(listAcoes[i]){
      listAcoes[i]["rankingRoic"] = i
    } 
  }
}


// ranquear por ev ebit
function ranquearPorEvEbit( listAcoes ){
  listAcoes.sort( sortEvEbit )

  for( i = 0 ; i < listAcoes.length ; i++){
    if(listAcoes[i]){
      listAcoes[i]["rankingEvEbit"] = i
    }
  }
}

function ranquearPorEarningYield(listAcoes){
  for( i = 0 ; i < listAcoes.length ; i++){
    if(listAcoes[i]){
      listAcoes[i]["earningYield"] = listAcoes[i]["rankingEvEbit"] + listAcoes[i]["rankingRoic"]
    }
  }  
}


function formulaMagicaGenerator( $ , callback ){

  let listAcoes = []
  let x = 0;  

 

  $("tbody > tr").each((i, ativoTR) => 
  {
    if( x < 80 ){
      x++

      
      let newDataRow = getDataFromHtmlTableRow(ativoTR)
      
      if( typeof newDataRow !== "undefined" ){

        listAcoes.push(newDataRow)
      }
      
      
      
      ranquearPorRoic( listAcoes )
      ranquearPorEvEbit( listAcoes )
      ranquearPorEarningYield( listAcoes)

      // rankear melhores ações e mais baratas      
      listAcoes.sort( sortEarningYield )

      // limpar dados inconsistences

       listAcoes = listAcoes.filter( i => i.liquidacaoBimestral >= ( data.data.liq_min || 0 ))
       listAcoes = listAcoes.filter( i => i.ev_Ebit > 0 && i.roicAmount >= ( data.data.roic_min || 0 )  )
      
    }
  })

  if( callback ) callback(listAcoes)

  return listAcoes
}


 


function getDataMaginFormula( callback ){

  
  var c = new Crawler({
    maxConnections : 10,
    method: 'POST',
    headers: {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.75 Safari/537.36",
      "X-Requested-With": "XMLHttpRequest"
    },
    form:data.data,

    callback : function (error, res, done) {
         
        formulaMagicaGenerator( res.$ , callback )
        done();
    }
  });


  c.queue("https://www.fundamentus.com.br/resultado.php")
}


module.exports = {
  getDataFromWeb:getDataMaginFormula,
  getDataMaginFormula,
}