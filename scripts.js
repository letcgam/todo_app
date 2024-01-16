const descCheckbox = document.querySelector("input[name=checkbox]");
const taskDescField = document.getElementsByClassName("task-desc")[0];
const taskList = document.getElementsByClassName("task");
const form = document.getElementById('form');
const editFormModel = document.getElementsByClassName('edit-form')[0];
const editForm = editFormModel.cloneNode(true);
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
    var sibilings = document.getElementById('task-list').children;
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
            userTasks[index][2] = true;
        } else {
            title.textDecoration = 'none';
            title.fontWeight = '700';
            title.color = 'white';
            desc.display = 'block';
            userTasks[index][2] = false;
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
    document.getElementById('task-list').appendChild(task);

    allowTaskCheck(task)
    allowEdit(task)

    if (done) {
        let checkbox = task.querySelector("input[name=task-check]");
        checkbox.dispatchEvent(new Event("change"));
    }
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
})

function allowEdit(task) {
    var btn = task.getElementsByClassName('edit-btn')[0];
    task.insertBefore(editForm, task.firstChild)

    btn.addEventListener('click', e => {
        var content = task.children;

        editForm.children[0].value = content[1].lastChild.firstChild.innerHTML;
        editForm.children[1].value = content[1].lastChild.lastChild.innerHTML;

        if (editForm.style.display === 'block') {
            content[1].style.display = 'flex';
            editForm.style.display = 'none';
            task.style.flexDirection = 'row';
            btn.firstChild.innerHTML = 'edit';
        } else {
            content[1].style.display = 'none';
            editForm.style.display = 'block';
            task.style.flexDirection = 'column';
            btn.firstChild.innerHTML = 'check';
        }
    })
}






// Visualizar dados:
// console.log(JSON.parse(localStorage.getItem('savedTasks')));

// LIMPAR O LOCAL STORAGE
// localStorage.setItem('savedTasks', [])
