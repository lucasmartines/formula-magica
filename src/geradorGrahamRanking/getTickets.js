const axios = require("axios")
const cherio = require("cheerio")
const fs = require("fs")



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

async function getAlltickets(){

    
    let data = await  fetchData("https://www.fundamentus.com.br/detalhes.php?papel=")

    let $ = cherio.load(  data  )
  
    let result = []
    
    $("tr").each( function () {

      let ticket = $(this).find("td").find("a").text()
      if(ticket.length>0){
          result.push( ticket )
      }
    })

    return result
     
}

const main = async () => {

    let _data = await getAlltickets()
    
    console.log(_data)
    fs.writeFileSync( __dirname + "/data_json/tickets.json", JSON.stringify(_data,null,2) )  
}

main();