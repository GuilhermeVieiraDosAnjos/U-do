const { async } = require('regenerator-runtime');
const Task = require('../models/TaskModel');

exports.index = async (req, res) => {
    const tasks = await Task.buscaPorTasks();
    res.render('index', { tasks });
}
