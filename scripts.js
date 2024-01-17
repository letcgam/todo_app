const container = document.getElementsByClassName('container')[0];
const descCheckbox = document.querySelector("input[name=checkbox]");
const taskDescField = document.getElementsByClassName("task-desc")[0];
const taskList = document.getElementsByClassName("task");
const taskSection = document.getElementById('task-list');
const form = document.getElementById('form');
const editForm = document.getElementById('edit-form');
const removeBtn = document.getElementById('rmv-btn');
var sibilings = document.getElementById('task-list').children;
var userTasks = [];

// ENCONTRANDO E EXIBINDO TASKS SALVAS
if (localStorage.getItem("savedTasks")) {
    userTasks = JSON.parse(localStorage.getItem("savedTasks"));
} else {
    localStorage.setItem('savedTasks', JSON.stringify(userTasks))
}

userTasks.forEach(task => {
    let name = task[0];
    let desc = task[1];
    let done = task[2];
    showTask(name, desc, done)
});

var h3 = document.getElementById('caption');
if (userTasks.length === 0) {
    h3.style.display = 'block';
} else {
    h3.style.display = 'none';
}

// CONTROLE DO CHECKBOX DO FORMULÁRIO
function showHide() {
    if (taskDescField.style.display === "flex") {
        taskDescField.style.display = "none";
    } else {
        taskDescField.style.display = "flex";
        taskDescField.focus();
    }
}
function check() {
    descCheckbox.checked = !descCheckbox.checked;
    showHide();
}

// PERMITIR CHECKAR TAREFAS
function allowTaskCheck(task) {
    var index = (Array.prototype.indexOf.call(sibilings, task));

    let checkbox = task.querySelector("input[name=task-check]");

    checkbox.addEventListener('change', () => {
        var title = task.getElementsByClassName('title')[0].style;
        var desc = task.getElementsByClassName('desc')[0].style;

        if (checkbox.checked === true) {
            title.textDecoration = 'line-through';
            title.fontWeight = '400';
            title.color = 'gray';
            desc.display = 'none';
            userTasks[index - 1][2] = true;
        } else {
            title.textDecoration = 'none';
            title.fontWeight = '700';
            title.color = 'white';
            desc.display = 'block';
            userTasks[index - 1][2] = false;
        }

        localStorage.setItem('savedTasks', JSON.stringify(userTasks));
    })
}

// Add tasks to document
function showTask(name, description, done = false) {
    // Create element to add
    // div task
    var task = document.createElement('div');
    task.classList.add('task');
    // div task-text
    var text = document.createElement('div');
    text.classList.add('task-text');
    // input checkbox
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'task-check';
    if (done) { checkbox.checked = true }
    // div task-info
    var info = document.createElement('div');
    info.classList.add('task-info');
    // title
    var title = document.createElement('h4');
    title.classList.add('title');
    title.innerHTML = name;
    // desc
    var desc = document.createElement('p');
    desc.classList.add('desc');
    desc.innerHTML = description;
    // link
    var btn = document.createElement('a');
    btn.classList.add('edit-btn');
    btn.href = '#';
    // span icon
    var icon = document.createElement('span');
    icon.classList.add('material-symbols-outlined');
    icon.innerHTML = 'edit';

    // Add elements to their parents
    btn.appendChild(icon);
    info.appendChild(title);
    info.appendChild(desc);
    text.appendChild(checkbox);
    text.appendChild(info);
    task.appendChild(text);
    task.appendChild(btn);
    // Add task to document
    taskSection.appendChild(task);

    allowTaskCheck(task)
    allowEdit(task)

    if (done) {
        let checkbox = task.querySelector("input[name=task-check]");
        checkbox.dispatchEvent(new Event("change"));
    }
}

// Add event listener to the edit buttons
function allowEdit(task) {
    var btn = task.getElementsByClassName('edit-btn')[0];

    var index = (Array.prototype.indexOf.call(sibilings, task));

    var title = task.getElementsByClassName('title')[0].innerHTML;
    var desc = task.getElementsByClassName('desc')[0].innerHTML;

    btn.addEventListener('click', () => {
        const header = document.getElementsByTagName('header')[0];
        header.children[0].innerHTML = 'Edit task'
        taskSection.style.display = 'none';
        form.style.display = 'none'

        editForm.style.display = 'block'
        editForm.children[0].value = title;
        editForm.children[1].value = desc;
        editForm.index = index - 1;
    })
}

function confirmEdit() {
    if (editForm.children[0].value) {
        const header = document.getElementsByTagName('header')[0];
        header.children[0].innerHTML = 'To Do'
        form.style.display = 'block'
        taskSection.style.display = 'flex';
        taskSection.style.flexDirection = 'column';

        editForm.style.display = 'none'
        userTasks[editForm.index][0] = editForm.children[0].value;
        userTasks[editForm.index][1] = editForm.children[1].value;

        localStorage.setItem('savedTasks', JSON.stringify(userTasks));
    } else {
        alert('Uma tarefa não pode ter título vazio.')
        taskList[editForm.index].lastChild.dispatchEvent(new Event("click"));
    }
}

function deleteTask() {
    userTasks.splice(editForm.index, 1);
    localStorage.setItem('savedTasks', JSON.stringify(userTasks));
}

// ADICIONAR TASKS À LISTA
form.addEventListener('submit', e => {
    e.preventDefault();
    // Receber dados do form
    let name = form.querySelector('input[class=task-title]').value;
    let desc = form.querySelector('textarea').value;

    // Resetar form
    form.reset()
    taskDescField.style.display = "none";

    // Add dados no localStorage
    if (name) {
        userTasks.push([name, desc, false]);
        localStorage.setItem('savedTasks', JSON.stringify(userTasks));
        showTask(name, desc);
    }

    location.reload();
})

removeBtn.addEventListener('click', () => {
    location.reload();
});

// Visualizar dados:
console.log(JSON.parse(localStorage.getItem('savedTasks')));

// LIMPAR O LOCAL STORAGE
// localStorage.setItem('savedTasks', [])
