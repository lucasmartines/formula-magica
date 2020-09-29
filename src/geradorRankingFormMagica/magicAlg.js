const axios = require("axios")
const cherio = require("cheerio")
const fs = require("fs")
var slugify = require('slugify')
const _ = require("lodash")

let jsonPath = __dirname+"/../public/json/new."

module.exports = {
    main
}

var stop = false;
 
async function main  ( limit , filtrar = false ) 
{
    let tickets = require(  "../geradorGrahamRanking/data_json/tickets.json")

    let all_stocks = []

    let startTime = new Date()

    for( i = 0 ; i <  ( limit || tickets.length )  ; i++)
    {

        if( stop ){
            break
        }
        
        let tickAtual = tickets[i]
        let ativoAtual = await  getByTick( tickAtual )
            ativoAtual = workAraund( ativoAtual )
        
        all_stocks.push( { ...ativoAtual , ativo:tickAtual } )
        
        // count tickets 
        console.log( i + "/"+ ( limit || tickets.length ) )
        
    }
    

    if(filtrar){


        all_stocks = all_stocks.filter(
            
            i => 
                 
                 _.isNumber( toNumber( i.ev_ebit ) ) && 
                 _.isNumber( toNumber( i.roic ) )  &&
                 _.isNumber( toNumber( i.vol_dollar_md_2m ) ) &&
                 _.isNumber( toNumber( i.ev_ebit ) ) &&
                 _.isNumber( toNumber( i.patrim_liq ) ) &&
                 toNumber( i.roic ) > 0 &&
                 toNumber( i.pl ) > 0   &&
                 toNumber( i.vol_dollar_md_2m ) > 1000000 &&
                 toNumber( i.patrim_liq ) > 0
        )

        

        ranquearPorRoic( all_stocks )
        ranquearPorEvEbit( all_stocks )
        ranquearPorEarningYield( all_stocks)
        
        // rankear melhores ações e mais baratas      
            all_stocks.sort( sortEarningYield )
    }



    let endTime = new Date()

    let diffTime = Math.abs( startTime - endTime )

    console.log( 
        "Minutes", Math.floor( diffTime / ( 1000 * 60) ), 
        "Seconds", diffTime / ( 1000 ), 
        "Mili" , diffTime )

    if( stop ){
        console.log("DIE")
        fs.writeFileSync(  jsonPath  +  "acoes_magic.json", JSON.stringify( all_stocks , null , 2 ) )  
        process.exit()
    }

    
    fs.writeFileSync(  jsonPath  +  "acoes_magic.json", JSON.stringify( all_stocks , null , 2 ) )  

  
    
}


process.on('SIGINT', function() {
    console.log( "exit..." )
    stop = true;
});


function sortEvEbit ( a , b )  {

    if( a.ev_ebit == b.ev_ebit )  return 0
    return ( a.ev_ebit > b.ev_ebit ) ? 1 : -1 
  }
  
  // greater go to up
function sortByRoic ( a , b )  {


  if( toNumber( a.roic ) == toNumber( b.roic ) )  return 0
  return ( toNumber( a.roic ) > toNumber( b.roic ) ) ? -1 : 1 
}
  
  // greater go to down
  // tendo em mente que as ações mais promissoras são as primeiras 
  // então as com numeros grandes são as ultimas, empurre elas para baixo
  function sortEarningYield ( a , b )  {

    if( toNumber( a.earningYield )  == toNumber( b.earningYield ) )  return 0
    return ( toNumber( a.earningYield ) > toNumber( b.earningYield ) ) ? 1 : -1 
  }
  

function ranquearPorRoic(listAcoes){

  listAcoes.sort( sortByRoic )
      
  for( i = 0 ; i < listAcoes.length ; i++){
    if(listAcoes[i]){
      listAcoes[i]["rankingRoic"] = i
     // console.log( listAcoes[i]["rankingRoic"] = i , listAcoes[i].roic )
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
    if(listAcoes[i])
    {

      listAcoes[i]["earningYield"] =  listAcoes[i]["rankingEvEbit"]  +  listAcoes[i]["rankingRoic"] 
     // console.log( listAcoes[i])
    }
  }  
}

function filtrarPorQtdVendasEmDollarEm2Meses(listAcoes , minNumber){
  
    listAcoes = listAcoes.filter( i => toNumber( i.vol_dollar_md_2m ) >=  minNumber )
    return listAcoes
}

async function fetchData (url) {
    const result = await axios.get(url,{
        headers:{
            // "Content-Type":"application/json; charset=UTF-8",
            "Content-Type":"text/html; charset=iso-8859-1",
            "User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36 OPR/71.0.3770.148"
        }
    })
    
    return result.data
}


const slugConfig  = {
  replacement: '_',  // replace spaces with replacement character, defaults to `-`
  remove: /[?*+~\.()'"!:@�/]/g, // remove characters that match regex, defaults to `undefined`
  lower: true,      // convert to lower case, defaults to `false`
  strict: false,     // strip special characters except replacement, defaults to `false`
  locale: 'vi'       // language code of the locale to use
}


function toNumber (value) 
{

    if( _.isNumber(value)) return value 


    //remove dots and convert to number
    if( _.isString( value )){

        value = +value.replace(/[\.%]/gi,"").replace(/[,]/gi,".");
    }

    return value
    

}

function workAraund(data){


    data.preco =  data["cotao"] 
    data.cotacao =  data["cotao"] 
    data.div_bruta = data["dv_bruta"]
    data.receita_liquida = data["receita_lquida"]
    data.marg_liquida = data["marg_lquida"]
    data.div_liquida  = data["dv_lquida"]
    data.patrim_liq  = data["patrim_lq"] 
    data.lucro_liquido  = data["lucro_lquido"]

    delete data["cotao"]
    delete data["dv_lquida"]
    delete data["dv_bruta"]
    delete data["receita_lquida"]
    delete data["marg_lquida"]
    delete  data["patrim_lq"] 
    delete  data["lucro_lquido"]
   
    return data
}

async function getByTick ( tick ) {

    if(!tick){
        throw new Error("Tick Invalido")
    }
    const content = await fetchData("https://www.fundamentus.com.br/detalhes.php?papel="+tick )
       
    const $ = cherio.load( content )

    let data = {}
    $(".label").each( function(){ 


        let key = slugify( $(this).text() , slugConfig)
        let value = $(this).next().text().replace(/�/,"").trim()
        data = { ...data ,  [key]:value } 
       
    })


    return data
}

