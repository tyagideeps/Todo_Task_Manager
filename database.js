const sequelize = require('sequelize');

const db = new sequelize({
    dialect : 'sqlite',
    storage : __dirname + '/todos.db'
});

console.log(__dirname);

const notes = db.define('notes', {
    id : {
        type : sequelize.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },

    note : {
        type : sequelize.STRING(1000) 
    }
})

const Todos = db.define('Todos', {
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

});

Todos.hasMany(notes);
notes.belongsTo(Todos);

module.exports = {
    db, Todos, notes
};