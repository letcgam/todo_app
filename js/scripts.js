// Seleção de elementos ----------------------------------------------------------------------
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");
const mainDiv = document.getElementById("main");
const settingsDiv = document.getElementById("settings");
const returnBtn = document.getElementById("return-btn");
const settingsBtn = document.getElementsByClassName("link-button")[0];
const submitBtn = document.getElementById("submit-config").children[0];
const themeSelect = document.getElementById("theme-select");
const theme = document.documentElement.style;
const imgRadio = document.getElementById("image-radio");
const colorRadio = document.getElementById("color-radio");
const inputLabel = document.getElementById("input-label");
const imageInput = document.getElementById("input");
const imageOutput = document.getElementById("image-output");
let oldInputValue;

if (!localStorage.getItem("theme")) {
  localStorage.setItem("theme", "default")
} else if (localStorage.getItem("theme") === "default") {
  setTheme("rgba(255, 255, 255, 0.5)", "1px solid #ccc", "#333", "#bbb");
} else if (localStorage.getItem("theme") === "dark") {
  setTheme("rgba(0, 0, 0, 0.5)", "1px solid #212121", "white", "#141414")
  themeSelect.value = "dark"
}

if (localStorage.getItem("wallpaper") != undefined) {
  document.body.style.backgroundImage = `url('${localStorage.getItem("wallpaper")}'`;
  imgRadio.checked = true;
} else {
  colorRadio.checked = true;
}

// Funções ----------------------------------------------------------------------
function setTheme(background, border, color, bodyBg) {
  theme.setProperty("--bg", background);
  theme.setProperty("--border", border);
  theme.setProperty("--font", color);
  theme.setProperty("--body-bg", bodyBg);
}

const saveTodo = (text, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  // Utilizando dados da localStorage
  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ text, done: 0 });
  }

  todoList.appendChild(todo);

  todoInput.value = "";
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;

      // Utilizando dados da localStorage
      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    todo.style.display = "flex";

    console.log(todoTitle);

    if (!todoTitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));

      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    default:
      break;
  }
};

// Eventos ----------------------------------------------------------------------
submitBtn.addEventListener('click', e => {
  localStorage.setItem("theme", themeSelect.value)
  if (colorRadio.checked) {
    localStorage.removeItem("wallpaper")
  }
})

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
});

returnBtn.addEventListener('click', () => {
  mainDiv.style.display = 'block';
  settingsBtn.style.display = 'block';
  settingsDiv.style.display = 'none'
})

settingsBtn.addEventListener('click', () => {
  mainDiv.style.display = 'none';
  settingsBtn.style.display = 'none';
  settingsDiv.style.display = 'block';
  if (imgRadio.checked) {
    inputLabel.style.fontSize = 'inherit';
    inputLabel.style.opacity = '1';
    imageOutput.width = '15rem';
    imageOutput.src = localStorage.getItem('wallpaper');
  }
})

imgRadio.addEventListener('click', () => {
  inputLabel.style.fontSize = 'inherit';
  inputLabel.style.opacity = '1';
  imageOutput.width = '15rem';
})

colorRadio.addEventListener('click', () => {
  inputLabel.style.fontSize = '0';
  inputLabel.style.opacity = '0';
  imageInput.value = null;
  imageOutput.style.width = '0';
})

imageInput.addEventListener('change', function (evt) {
  if (!(evt.target && evt.target.files && evt.target.files.length > 0)) {
    return;
  }
  var r = new FileReader();
  r.onload = function () {
    imageOutput.src = r.result;
    try {
      localStorage.setItem('wallpaper', r.result)
    } catch {
      alert("Invalid file.")
    }
  }
  r.readAsDataURL(evt.target.files[0]);
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText || "";
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");

    updateTodoStatusLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();

    // Utilizando dados da localStorage
    removeTodoLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

// Local Storage
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text != todoText);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos();
