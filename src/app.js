const {getDataMaginFormula}  = require ( "./geradorRankingFormMagica/magicAlg.js" )
var cors = require('cors');


const express = require('express')
const app = express()
app.use(cors());



app.get('/api/ranking/magic', function (req, res) {

    getDataMaginFormula( ( resultado ) => res.json(resultado) )
})

app.use( express.static(__dirname + '/public'));


app.use('/graham', (req,res) => res.sendFile( __dirname + "/public/grahan_formula.html" ))
app.use('/', (req,res) => res.sendFile( __dirname + "/public/magic_formula.html" ))


app.listen(3000 , () => console.log("Rodando... localhost:3000"))