const sequelize = require('sequelize')

const db = new sequelize({
    dialect : 'sqlite',
    storage : __dirname + '/taskTodo.db'
})

const taskNotes = db.define('taskNotes', {
    id : {
        type : sequelize.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },

    note : {
        type : sequelize.STRING(1000) 
    }
})

const taskTodo = db.define('taskTodo', {
    id : {
        type : sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    title : {
        type : sequelize.STRING(50),
        allowNull: false
    },

    description : {
        type : sequelize.STRING(100) 
    },

    dueDate : {
        type : sequelize.DATEONLY,
        allowNull: false
    },

    status : {
        type : sequelize.BOOLEAN,
        defaultValue : true
    },

    priority : {
        type : sequelize.ENUM,
        values : ['high', 'medium', 'low'],
        defaultValue : true,
        allowNull: false
    }

})

taskTodo.hasMany(taskNotes);
taskNotes.belongsTo(taskTodo);

module.exports = {
    db, taskTodo, taskNotes
};