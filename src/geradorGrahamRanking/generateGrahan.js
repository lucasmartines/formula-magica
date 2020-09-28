const {main} = require("./grahamAlg.js")

async function run(){
    // se o próximo parametro é false então o valor a ser retornado
    // não terá filtragem ou seja todas as ações (dentro do limite no primeiro parametro) serão retornadas
    //await main( 10 , true);
    await main( 3 , false);
    
}

run();