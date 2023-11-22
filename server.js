require('dotenv').config()//Referente as variaveis de ambiente, que estão configuradas no .env
const express = require("express");
const app = express();
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(()=>{
        console.log('Conectei a base de dados')
        app.emit('Conectado')
    }).catch(e=>console.log(e));
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const routes = require('./router');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const {middlewareGlobal, checkCSRFError, csrfMiddleware } = require('./src/middlewares/middleware');
const { log } = require('console');
const EventEmitter = require('events')

//Limite de Listeners
EventEmitter.setMaxListeners(15)



app.use(helmet());//Verificar se o helmet não ta dando b.o
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.resolve(__dirname, 'public')))

//css
app.use(express.static(path.join(__dirname, 'public') ));

const sessionOptions = session({
    secret: 'thismysecret',
    store:  MongoStore.create({
        mongoUrl: process.env.CONNECTIONSTRING,
        mongooseConnection: mongoose.connection,
        collectionName: 'sessions'
    }), // Correção aqui
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    httpOnly: true
});
/*Ok, pelo o que eu descobri temos que retirar o session quando iniciamos o MongoStore, os parametros tem que ser passados dessa forma, com o create e sem o new, para que dê tudo certo*/


app.use(sessionOptions);
app.use(flash());
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

//CSRF
app.use(csrf())

//Nossos próprios middlewares
app.use(middlewareGlobal);
app.use(checkCSRFError);
app.use(csrfMiddleware);
app.use(routes);

app.on('Conectado', ()=>{
    app.listen(3006, ()=>{
        console.log('Servidor executando na porta 3006')
        console.log('Acessar  http://localhost:3006')
    })
})