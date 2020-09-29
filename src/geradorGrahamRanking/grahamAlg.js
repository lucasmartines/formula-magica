const axios = require("node_modules/axios")
const cherio = require("cheerio")
const fs = require("fs")
var slugify = require('node_modules/slugify')
let filtro = require("./filtro.js")

let jsonPath = __dirname+"/../public/json/new."

module.exports = {
    main
}

async function main  ( limit , filtrar = false ) 
{
    let tickets = require(  "./data_json/tickets.json")

    let all_stocks = []


    for( i = 0 ; i <  ( limit || tickets.length )  ; i++)
    {
        let tickAtual = tickets[i]
        
        let ativoAtual = await  getByTick( tickAtual )
        
        ativoAtual = workAraund( ativoAtual )
        
        
        all_stocks.push( { ...ativoAtual , ativo:tickAtual } )
        

        // count tickets 
        console.log( i + "/"+ ( limit || tickets.length ) )
        
    }


    if(filtrar){

        all_stocks = filtro.run(all_stocks)

    }

    // console.log( all_stocks )
    fs.writeFileSync(  jsonPath  +  "acoes_graham.json", JSON.stringify( all_stocks , null , 2 ) )  

    
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

    if( !isNaN(value ) ){ // is number
        value = +value 
        return value
    }else{
        //remove dots and convert to number
        value = value.replace(/[\.]/g,"");

        if( !isNaN(value ) ){// is number
            value = +value 
        }
        return value
    }

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

