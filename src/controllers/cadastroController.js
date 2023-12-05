const { async } = require('regenerator-runtime');
const {Cadastro} = require("../models/CadastroModel")

exports.index = (req, res) => {
    res.render('cadastro');
    return
}

exports.register = async function(req,res) {
    try{
        const cadastro = new Cadastro(req.body);
        await cadastro.register();

        if(cadastro.errors.length > 0 ) {
            // req.flash('errors', cadastro.errors);Essa é a padrão estamos fazendo testes
            req.flash('errors', cadastro.errors);
            req.session.save(function(){
                return res.redirect('/cadastro')
            });
            return
        }

        console.log('Cadastro foi bem sucedido')
        req.flash('success', 'Cadastrado com sucesso');
        req.session.save(function(){
            return res.redirect('/');//mudando pra redirecionar ao index
        });
    }catch(e){
        console.log("Erro no cadastro", e);
        return res.render('404')
        // return res.render('/')
    }

}