const express = require('express');
const mustache = require('mustache-express');
const router = require('./routes/index');
const helpers = require('./helpers');
const errorHandler = require ('./handlers/errorHandler');

/*middleware
- PROCESSO DE LOGIN (ENTRADA DE DADOS) REQ OU RES
1- REQUISIÇÃO 

Meio do processo (Middleware) -> Validar os campos (
Middleware Global - Pode funcionar em toda aplicação
Middleware Local - Funciona em partes especificas

2- RESPOSTA
--POSITIVA (Usuario logado, ok segue)
--NEGATIVA (Usuario não autorizado não prossegue o login)


*/

const app = express();  

//inserido helper 23/10
app.use((req, res, next)=>{
    res.locals.h = helpers;
    res.locals.teste = "123";
    next();
})

app.use('/', router);


app.use(errorHandler.notFound);

app.use(express.json());

app.engine('mst', mustache(__dirname+'/views/partials', '.mst'));
app.set('view engine', 'mst');
app.set('views', __dirname + '/views');

module.exports = app;

 