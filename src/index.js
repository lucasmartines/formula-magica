const {getDataMaginFormula}  = require ( "./geradorRanking" )
var cors = require('cors');


const express = require('express')
const app = express()
app.use(cors());



app.get('/api/ranking/magic', function (req, res) {

    getDataMaginFormula( ( resultado ) => res.json(resultado) )
})

app.use( express.static(__dirname + '/public'));


app.use('/', (req,res) => res.sendFile( __dirname + "/public/index.html" ))

app.listen(3000 , () => console.log("Rodando... localhost:3000"))