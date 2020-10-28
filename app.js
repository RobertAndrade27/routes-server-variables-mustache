const express = require('express');
const mustache = require('mustache-express');
const router = require('./routes/index');
const helpers = require('./helpers');
const errorHandler = require ('./handlers/errorHandler');
const cookieParser = require ('cookie-parser');
const session = require ('express-session');
const flash = require('express-flash');


const app = express();  


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname+'/public'));

app.use(cookieParser(process.env.SECRET));
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,   
}));

app.use(flash());

//inserido helper 23/10
app.use((req, res, next)=>{
    res.locals.h = helpers;
    res.locals.flashes = req.flash();
    next();
});


//Rotas
app.use('/', router);


//Erros
app.use(errorHandler.notFound);


//Mustache
app.engine('mst', mustache(__dirname+'/views/partials', '.mst'));
app.set('view engine', 'mst');
app.set('views', __dirname + '/views');

module.exports = app;





 
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