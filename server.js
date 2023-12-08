
// Importing necessary modules
require('dotenv').config() // Referente as variaveis de ambiente, que estão configuradas no .env
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const routes = require('./router');
const path = require('path');
// const helmet = require('helmet');
const csrf = require('csurf');
const { middlewareGlobal, checkCSRFError, csrfMiddleware } = require('./src/middlewares/middleware');
const { log } = require('console');
const EventEmitter = require('events')

// Setting up the maximum number of listeners
EventEmitter.setMaxListeners(15)

// Connecting to the database
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        console.log('Conectei a base de dados')
        app.emit('Conectado')
    }).catch(e => console.log(e));

// Configuring the session middleware
const sessionOptions = session({
    secret: 'thismysecret',
    store: MongoStore.create({
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

// Configuring the app
// Verificar se o helmet não ta dando b.o
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')));

// Serving CSS files
app.use(express.static(path.join(__dirname, 'public')));

app.use(sessionOptions);
app.use(flash());
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Configuring the CSRF middleware
app.use(csrf());

// Using custom middlewares
app.use(middlewareGlobal);
app.use(checkCSRFError);
app.use(csrfMiddleware);
app.use(routes);

app.on('Conectado', () => {
    app.listen(3006, () => {
        console.log('Servidor executando na porta 3006')
        console.log('Acessar http://localhost:3006')
    })
})
//
//This code has been updated with proper commenting to provide a clear and concise understanding of the code..</s>
//35.199.124.175