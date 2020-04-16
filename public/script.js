

async function getData(){
    let res = await fetch("/todo");
    let data = await res.json();
    addToTable(data);
}

const table = document.querySelector("#table");
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const dueDate = document.querySelector('#dueDate');
// const status = document.querySelector('#status');
const priority = document.querySelector('#priority');
const note = document.querySelector('#note');
const submit = document.querySelector("#btn");
const sortBy = document.querySelector("#sort");
const modal = document.getElementById("myModal");

let today = new Date();
let tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(tomorrow.getHours() + 6);
dueDate.defaultValue = tomorrow.toJSON().substring(0,10);

function addToTable(data){
    table.innerHTML = "";
    let row = newElement('tr', null);
    table.appendChild(row);
    row.appendChild(newElement('th', 'Index'));
    row.appendChild(newElement('th', 'Title'));
    row.appendChild(newElement('th', 'Description'));
    row.appendChild(newElement('th', 'Due Date'));
    row.appendChild(newElement('th', 'Status'));
    row.appendChild(newElement('th', 'Priority'));

    if(data.length == 0){
        let row = newElement('tr', null);
        table.appendChild(row);
        let data = newElement('td', 'No data to display');
        row.appendChild(data);
        data.colSpan = "6";
        data.style.textAlign = "center";
        data.style.color = "gray";
    }
    else{
        data = sortData(data, sortBy.value);
        let indexVal = 1;
        for(item of data){
            let row = newElement('tr', null);
            table.appendChild(row);
            row.appendChild(newElement('td', indexVal));
            row.appendChild(newElement('td', item.title));
            row.appendChild(newElement('td', item.description));
            row.appendChild(newElement('td', item.dueDate));
            var statusVal = "Incomplete";
            if(item.status == true){
                statusVal = "Complete";
            }
            row.appendChild(newElement('td', statusVal));
            row.appendChild(newElement('td', item.priority));
            let rowNote = newElement('tr', null);

            table.appendChild(rowNote);
            rowNote.className = 'notes';
            rowData = document.createElement('td');
            rowNote.appendChild(rowData);
            getNotes(item.id, rowData);
            rowData.colSpan = 6;
            indexVal++;
            
        }
    }
    
}

function newElement(type, data){
    let element = document.createElement(type);
    if(data != null){
        element.textContent = data;
    }
    return element;
}

async function addTask(){
    let data = {
        title : title.value,
        description : description.value,
        status : false,
        priority : priority.options[priority.selectedIndex].value,
        dueDate : dueDate.value,
        note : note.value
    };


    if(data.title != "" && data.dueDate != "" && data.priority != ""){
        let res = await fetch("/todo",
        {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            });
        let respData = res.body;
        title.value = "";
        description.value = "";
        dueDate.value = tomorrow.toJSON().substring(0,10);
        priority.value = 'medium';
        note.value = "";
        getData();
        }
    
    
}

async function getNotes(id, rowData){
    var xhr = new XMLHttpRequest;
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4 && xhr.status == 200) {
            let data = JSON.parse(this.responseText);
            let list = newElement('ul', null);
            
            for(let note of data){
                list.appendChild(newElement('li', note.note));
            }
            rowData.appendChild(list);
            let input = newElement('input', null);
            let btn = newElement('input', null);
            let edit = newElement('button', 'Edit');
            rowData.appendChild(input);
            rowData.appendChild(btn);
            rowData.appendChild(edit);
            input.type = 'text';
            btn.type = 'button';
            btn.value = 'Add Note';
            btn.onclick = function(){
                addNote(input, id);
            }
            input.id = id + "_input";
            edit.className = 'editButton';
            edit.onclick = function(){
                getEditPortal(id);
            }
          }
    }
    xhr.open("GET", "/todo/" + id + "/notes");
    xhr.send();
}

async function addNote(input, id){
    if(input.value != ""){
        data = {
            note : input.value,
            TodoId : id
        };
        let res = await fetch("/todo/" + id + "/notes",
            {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
                });
        let respData = res.body;
        getData();
    }
}

function sortData(data, sortValue){
    switch(sortValue){
        case "dueDate" : return sortByDueDate(data);

        case "priority" : return sortByPriority(data);

        case "status" : return sortByStatus(data);

        default : return data;
    }
}

function sortByDueDate(data){
    console.log(data);
    data.sort(function(o1,o2){
        if (o1.dueDate < o2.dueDate)    return -1;
        else if(o1.dueDate > o2.dueDate) return  1;
        else                      return  0;
      });
      return data;
}

function sortByPriority(data){
    console.log(data);
    let dummyData = data;
    for(let item of dummyData){
        if(item.priority == "medium"){
            item.priority = 2;
        }
        else if(item.priority == "high"){
            item.priority = 1;
        }
        else{
            item.priority = 3;
        }
    }
    dummyData.sort(function(o1,o2){
        if (o1.priority < o2.priority)      return -1;
        else if(o1.priority > o2.priority)  return  1;
        else                                return  0;
      });
      for(let item of dummyData){
        if(item.priority == 2){
            item.priority = "medium";
        }
        else if(item.priority == 1){
            item.priority = "high";
        }
        else{
            item.priority = "low";
        }
    }
    return dummyData;
}

function sortByStatus(data){
    console.log(data);
    data.sort(function(o1,o2){
        if (o1.status == true && o2.status == false)    return -1;
        else                                            return  1;
      });
      return data;
}

function getEditPortal(id){
    modal.style.display = "block";
    fetch("/todo/" + id).then((data) => data.json().then((data) => {
        document.querySelector("#editTitle").value = data.title;
        document.querySelector("#editDescription").value = data.description;
        document.querySelector("#editDueDate").value = data.dueDate;
        document.querySelector("#editPriority").value = data.priority;
        document.querySelector("#editStatus").checked = data.status;
        document.querySelector("#saveBtn").onclick = function(){
            saveChanges(id);
        }
    }));
}

async function saveChanges(id){
    let data = {
        dueDate : document.querySelector("#editDueDate").value,
        priority : document.querySelector("#editPriority").value,
        status : document.querySelector("#editStatus").checked
    }
    console.log(data);
    let res = await fetch("/todo/" + id,
        {
            method : 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    modal.style.display = "none";
    getData();
}


submit.onclick = addTask;

sortBy.onchange = getData;

document.getElementsByClassName("close")[0].onclick = function() {
    modal.style.display = "none";
    document.querySelector("#saveBtn").onclick = null;
  }