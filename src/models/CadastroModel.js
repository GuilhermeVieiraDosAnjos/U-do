const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const { stringifyRequest } = require('css-loader/dist/utils');

const CadastroSchema = new mongoose.Schema({
    nome : {type: String, required : true},
    email: {type: String, required: true},
    password: { type: String, required: true },
});

const CadastroModel = mongoose.model('Cadastro', CadastroSchema);

class Cadastro {
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null
    }

    
    async register(){
        //Registrar dados do usuário
        this.valida();

        if(this.errors.length > 0) return;
        
        //Verificar se o user Existe
        await this.userExists();
        
        if(this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

        this.user = await CadastroModel.create(this.body)

    }

    
    async userExists(){
        //Verifica se o usuário existe procurando o email no Banco de dados
        this.user = await CadastroModel.findOne({email: this.body.email});

        //Se existir o email cadastrado já no email, adiciona o erro no array e retorna ao usuário o erro
        if(this.user)  this.errors.push('Esse email já está cadastrado');
    }
    
    
    valida(){
        this.cleanUp()
        //Verifica se é um email válido
        if(!validator.isEmail(this.body.email)) this.errors.push('Email inválido');

        //Se a senha é menor que 6 e maior que 12
        if(this.body.password.length < 6 || this.body.password.length >12){
            this.errors.push('A senha deve ter entre 6 e 12 caracteres');
        }
    }

    cleanUp(){
        //Serve para limpar os 
        for(const key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }
        }

        this.body = {
            nome : this.body.nome,
            email: this.body.email,
            password: this.body.password
        }
    }
}

//Exporta a classe cadastro
module.exports = {
    Cadastro,
    CadastroModel    
};
