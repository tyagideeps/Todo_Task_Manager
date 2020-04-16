const express = require('express');
const app = express();
const {db, Todos, notes} = require('./database');

app.use(express.json());

app.use('/', express.static(__dirname + '/public'));

app.set( 'port', ( process.env.PORT || 4567 ));

db.sync().then(
    () => app.listen(app.get( 'port' ))
    ).catch(
      (err) => console.error(err)
    );


app.get('/todo/:id', (req, res) => {
    var id = req.params.id;
    if(isNaN(parseInt(req.params.id))){
        req.status(404).send({
            error : 'invalid todo id'
        });
        return;
    }
    Todos.findOne({
        attributes : ['id', 'title', 'description', 'dueDate', 'status', 'priority'],
        where : {
            'id' : id
        }
    }).then((data) => {
        res.send(data);
    });
    
});

app.get('/todo', (req, res) => {
    Todos.findAll({
        attributes : ['id', 'title', 'description', 'dueDate', 'status', 'priority']
    }).then((todos) => res.send(todos));
});

app.post('/todo', (req, res) => {
    let data = req.body;
    Todos.create(data).then(
        (retVal) => {
            console.log(retVal);
            if(data.note != ''){
                let noteData = {
                    note : data.note,
                    TodoId : retVal.dataValues.id
                }
                notes.create(noteData).then(() => res.send(""));
            }
            else{
                res.send("");
            }
        });
});

app.get('/todo/:id/notes', (req, res) => {
    id = req.params.id;
    notes.findAll({
        attributes: ['note'],
        where : {
            TodoId : id
        }
    }).then((data) => res.send(data));
});

app.post('/todo/:id/notes', (req, res) => {
    id = req.params.id;
    data = req.body;
    data.TodoId = Number(id);
    Todos.findAll({
        attributes : ['id']
    }).then((list) => {
        for(let item of list){
            if(item.id == id){
                notes.create(data).then(() => res.send(""));
                return;
            }
        }
        res.status(404);
        res.send({error : 'Invalid Id'});
    });
});

app.patch('/todo/:id', (req, res) => {
    let Taskid = req.params.id;
    let data = req.body;
    Todos.findOne({
            where : {
                id : Taskid
            }
        }
    ).then((todo) => {
            todo.dueDate = data.dueDate;
            todo.priority = data.priority;
            todo.status = data.status;
            todo.save().then(() => res.send(""));
    })
})