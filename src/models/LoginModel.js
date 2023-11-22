//Será usado para fazer a pagina de cadastro do usuário
//Fazer uma checagem para ver se a senha não é a mesma(código do POO)

const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const {CadastroModel} = require('../models/CadastroModel')


//ISSO AQUI POR ENQUANTO TA SAINDO POR CONTA QUE NÃO ESTAMOS SALVANDO NADA NO BANCO  DE DADOS SOMENTE VERIFICANDO E FAZENDO A VALIDAÇÃO 
// const LoginSchema = new mongoose.Schema({
//   email: { type: String, required: true },
//   password: { type: String, required: true }
// });

// const LoginModel = mongoose.model('Login', LoginSchema);

// const CadastroSchema = new mongoose.Schema({
//   nome : {type: String, required : true},
//   email: {type: String, required: true},
//   password: { type: String, required: true },
// });

// const CadastroModel = mongoose.model('Cadastro', CadastroSchema);


class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.valida();
    if (this.errors.length > 0) return;
    this.user = await CadastroModel.findOne({ email: this.body.email });

    if (!this.user) {
      this.errors.push('Usuário não existe.');
      return;
    }

    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida');
      this.user = null;
      return;
    }
  }


/*Não é necessário pois agora o register está no cadastro, logo também não é necessário o UserExists
  // async register() {
  //   this.valida()

  //   if (this.errors.length > 0) return;

  //   await this.userExists()

  //   if (this.errors.length > 0) return;

  //   const salt = bcryptjs.genSaltSync();
  //   this.body.password = bcryptjs.hashSync(this.body.password, salt);

  //   this.user = await LoginModel.create(this.body)

  // }

  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email });

    // this.user ? true : false;
    if (this.user) this.errors.push('Esse Usuário já existe')
  }
*/


  //Não tenho ideia do motivo desse valida não estar sendo usado mas deixa ai 
  // valida() {
  //     this.cleanUp();

  //     // Validação
  //     // O e-mail precisa ser válido
  //     if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');

  //     // A senha precisa ter entre 6 e 12
  //     if(this.body.password.length < 3 || this.body.password.length > 50) {
  //       this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
  //     }
  // }

  valida() {
    this.cleanUp();

    // Validação
    // O e-mail precisa ser válido
    if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');

    // A senha precisa ter entre 6 e 12
    if (this.body.password.length < 6 || this.body.password.length > 12) {
      this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
    }
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }


    this.body = {
      email: this.body.email,
      password: this.body.password,
    }
  }
}

module.exports = Login;