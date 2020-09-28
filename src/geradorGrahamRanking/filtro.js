//main()
module.exports = {
    run
}
function main()
{
    const fs = require("fs")
    const file = fs.readFileSync( __dirname + "./data_json/all_tickets_arrumado.json")

    let data = JSON.parse(file) 

    data = run( data )

    fs.writeFileSync( __dirname + "./data_json/all_tickets_filtrado.json", JSON.stringify(data,null,2))
}


function run( data )
{
    data = removerFalhas(data)

    data = filterLpaMaiorQue(0,data)
    data = filterPl(data)
    data = filterVpaMaiorQue(0,data)
    data = filterVolume( data , 28000)
    data = calcularBenjaminGrahan(data)
    data = filterMargenSegMaior0(data )
    data = ordenarPorMargemSeg( data )
    
    
    data.forEach( i => {
        console.log( i.cotacao, i.lpa , i.vpa , i.graham,i.grahanAmount , i.margemSeg , i.possibilidadeGanho)
    })
    console.log( data.length )

    return data 
}



// de cima {maior} para baixo  menor
function ordenarPorMargemSeg( data )
{
    return data.sort ( ( ant , prox  ) => {
        
        if( ant.margemSeg < prox.margemSeg ){
            return 1 // o menor vai para frente ou baixo
        }else if( ant.margemSeg > prox.margemSeg ){
            return -1 // o maior vai para tras ou cima
        }else{
            return 0
        }
    } )
}

/* deve garantir que apenas empresas que tenham lucro 
ou seja pl > que 0 */
function filterPl(data){


    data = data.filter( (i)=> {

        let pl = filterNumber(i.pl)

        return pl > 0
    })
    return data 
}

/* deve garantir que o lucro por ação é maior que 0,
as vezes o filter PL é > 0 mas o lpa [que estranho] não esse método 
garante empresas lucrativas */
function filterLpaMaiorQue(min,data){


    data = data.filter( (i)=> {

        let lpa = filterNumber(i.lpa)

        return lpa > min
    })
    return data 
}


function filterVpaMaiorQue(min,data){


    data = data.filter( (i)=> {

        let vpa = filterNumber(i.vpa)

        return vpa > min
    })
    return data 
}

/* deve garantir que somente NÃO numeros serão filtrados,
imagine 10.000,99, ele converte em 10000.99 removendo  e 
também 10.000.000,99 10000000.99
o ponto e a virgula */
function filterNumber(n){
    if( isNaN(n)){

        return  +n.replace(/\./gi,"").replace(",",".")
    }else{
        return n
    }
}

/* gerar a formula de benjamin graham
e também a margem de segurança => margemSeg
e também o tanto que o preço do ativo vale em relação ao valor justo => grahamAmount
o valor justo => graham 
e a possiblidade de ganho = ( ( valor_justo / cotação ) - 1 ) * 100 */
function calcularBenjaminGrahan(data){

    data.forEach( i => {
        
        let lpa = filterNumber(i.lpa)
        let vpa = filterNumber(i.vpa)
        let cotacao = filterNumber( i.cotacao )
        let graham = Math.sqrt( 22.5  * lpa  * vpa)
        
        i.graham = graham
        i.valor_justo = i.graham
        
        // é o quanto uma cotação está cara em relação ao preço justo
        let grahanAmount = (  cotacao / graham ) * 100 
        i.margemSeg    = 100 - grahanAmount.toFixed(0) 


        i.grahanAmount = grahanAmount + "%"
        i.possibilidadeGanho = ( ( ( graham / cotacao ) - 1 ) * 100  ).toFixed(0) + "%"
      

    });

    return data
}
function filterMargenSegMaior0(data  ){


    data = data.filter( (i)=> {

        let margemSeg = filterNumber(i.margemSeg)

        return margemSeg > 0
    })
    return data 
}

function filterVolume(data , vol_dolar_2_meses ){


    data = data.filter( (i)=> {

        let vol_dollar_md_2m = filterNumber(i.vol_dollar_md_2m)

        return vol_dollar_md_2m > vol_dolar_2_meses
    })
    return data 
}

function removerFalhas(data){

    data.forEach( i => {
       
        // remover falha de escrita
        if( i.cotao ){
            i.cotacao = i.cotao
        }


    });

    return data
}

