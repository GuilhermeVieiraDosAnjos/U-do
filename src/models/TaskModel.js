const mongoose = require('mongoose');
const { async } = require('regenerator-runtime');
const validator = require('validator');

const TaskSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descricao: { type: String, required: false, default: '' },
    // email: { type: String, required: false, default: '' },
    // telefone: { type: String, required: false, default: '' },
    // criadoEm: { type: Date, default: Date.now },
    //Por enquanto é so isso mesmo depois irei adicionar o tempo 
});

const TaskModel = mongoose.model('Task', TaskSchema);

function Task(body) {
    this.body = body;
    this.errors = [];
    this.task = null;
}

Task.prototype.register = async function () {
    // this.valida();

    if (this.errors.length > 0) return;
    this.task = await TaskModel.create(this.body)

}

Task.prototype.valida = function () {
    this.cleanUp();

    // // Validação
    // // O e-mail precisa ser válido
    // if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
    // if (!this.body.nome) this.errors.push('Nome é um campo obrigatório');
    // if (!this.body.email && !this.body.telefone) {
    //     this.errors.push('Pelo menos um tipo de Task precisa ser enviado: EMAIL ou TELEONE');
    // }
}

Task.prototype.cleanUp = function () {
    for (const key in this.body) {
        if (typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }


    this.body = {
        titulo: this.body.titulo,
        descricao: this.body.descricao,
        // email: this.body.email,
        // telefone: this.body.telefone,
    }
}


Task.prototype.edit = async function (id) {
    if (typeof id !== 'string') return;

    // this.valida();
    if (this.errors.length > 0) return;
    this.task = await TaskModel.findByIdAndUpdate(id, this.body, { new: true });
}

//Métodos estáticos(não tem acesso ao prototype, this.valida, this.errors)
Task.buscaPorID = async function (id) {

    if (typeof id !== 'string') return;
    // const Task = await ContatoModel.findOne({ _id: id });
    const task = await TaskModel.findById(id);
    return task;
}

Task.buscaPorTasks = async function () {
    const task = await TaskModel.find()
    .sort({ criadoEm: -1});
    return task;
}
Task.delete = async function (id) {
    if (typeof id !== 'string') return;
    const task = await TaskModel.findOneAndDelete({_id: id})
    return task;
}

module.exports = Task;

