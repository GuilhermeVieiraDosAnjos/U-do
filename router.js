const express = require('express');
const route = express.Router();

const homeController = require('./src/controllers/homeController')
const loginController = require('./src/controllers/loginController')
const taskController = require('./src/controllers/taskController')
const cadastroController = require('./src/controllers/cadastroController')
// const manTaskController = require('./src/controllers/manTaskController')

const { loginRequired } = require('./src/middlewares/middleware')

//Rotas da home
route.get('/', homeController.index);

//Rotas de cadastro
route.get('/cadastro', cadastroController.index);
route.post('/cadastro/register', cadastroController.register);




//Rotas de login
route.get('/login/index', loginController.index)
// route.post('/login/register', loginController.register) ELE vai embora pq agora o cadastro é na rota de cadastro
route.post('/login/login', loginController.login)
route.get('/login/logout', loginController.logout)


//Rotas de Tarefas
route.get('/task/index', taskController.index)
route.get('/addTask/index', taskController.add)
route.post('/task/register', taskController.register)
route.get('/addTask/edit/:id', taskController.editIndex)
route.post('/addTask/edit/:id', taskController.edit) 
route.get('/task/delete/:id', taskController.delete) 

//Rota para criar tarefa



module.exports = route