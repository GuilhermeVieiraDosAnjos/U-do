const { response } = require('express')
const Task = require('../models/TaskModel');
const { async } = require('regenerator-runtime');

exports.index = async (req, res) => {
    const task = await Task.buscaPorTasks();
    res.render('tasks', { task })
}

exports.add = (req,res) =>{
    res.render('addTask', { task: {} })
}


exports.register = async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.register();

        if (task.errors.length > 0) {
            req.flash('errors', task.errors);
            req.session.save(() => res.redirect("back"));
            return;
        }

        req.flash('success', 'Tarefa salva com sucesso');
        req.session.save(() => res.redirect(`/task/index`));
        return;
    } catch (e) {
        console.log(e);
        return res.render('404')
    }

}

exports.editIndex = async function (req, res) {
    if (!req.params.id) return res.render('404');

    const task = await Task.buscaPorID(req.params.id);

    if (!task) return res.render('404');

    res.render('addTask', { task })

}

exports.edit = async (req, res) => {
    try {
        if (!req.params.id) return res.render('404');
        const task = new Task(req.body);

        await task.edit(req.params.id);

        if (task.errors.length > 0) {
            req.flash('errors', task.errors);
            req.session.save(() => res.redirect("back"));
            return;
        }

        req.flash('success', 'Sua tarefa foi editado com sucesso');
        req.session.save(() => res.redirect(`/task/index`));
        return;
    } catch (e) {
        console.log(e);
        res.render('404');
    }
}

exports.delete = async function(req, res){
    if (!req.params.id) return res.render('404');

    const task = await Task.delete(req.params.id);

    
    if (!task) return res.render('404');

    req.flash('success', 'Tarefa apagado com sucesso');
    req.session.save(() => res.redirect('/task/index'));
    return;
}
