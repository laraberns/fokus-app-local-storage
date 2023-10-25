const taskListContainer = document.querySelector(".app__section-task-list")
const taskIconSvg = `<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="12" fill="#FFF" />
<path
    d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
    fill="#01080E" />
</`
const formTask = document.querySelector(".app__form-add-task")
const toggleFormTaskBtn = document.querySelector(".app__button--add-task")
const textArea = document.querySelector(".app__form-textarea")
const cancelFormBtn = document.querySelector(".app__form-footer__button--cancel")
const taskAtiveDescription = document.querySelector(".app__section-active-task-description")
const labelForm = document.querySelector('.app__form-label')
const deleteFormBtn = document.querySelector(".app__form-footer__button--delete")
const deleteDoneTasks = document.querySelector("#btn-remover-concluidas")
const deleteAllTasks = document.querySelector("#btn-remover-todas")

let localStorageTasks = localStorage.getItem('tasks')

if (localStorageTasks) {
    tasks = JSON.parse(localStorageTasks)
} else {
    tasks = []
}


function createTask(task) {
    const li = document.createElement("li")
    li.classList.add("app__section-task-list-item")

    const svgIcon = document.createElement('svg')
    svgIcon.innerHTML = taskIconSvg

    const paragraph = document.createElement("p")
    paragraph.classList.add("app__section-task-list-item-description")

    const button = document.createElement('button')
    button.classList.add('app_button-edit')
    button.innerHTML = `<img src="./imagens/edit.png" alt="img button edit">`

    paragraph.textContent = task.description

    li.appendChild(svgIcon)
    li.appendChild(paragraph)
    li.appendChild(button)

    return li
}

function createTasks(task) {
    taskListContainer.appendChild(createTask(task))
}

tasks.forEach(createTasks)

toggleFormTaskBtn.addEventListener("click", hideShowForm)

function hideShowForm() {
    formTask.classList.toggle("hidden")
    labelForm.innerText = "Adicionando tarefa"
}

formTask.addEventListener("submit", preventDefaultAndSave)

function preventDefaultAndSave(event) {
    event.preventDefault()

    let list = document.querySelectorAll(".app__section-task-list-item-description")
    let arrayList = []

    list.forEach(pushArrayDescription)

    function pushArrayDescription(item) {
        arrayList.push(item.innerText)
    }

    for (let index = 0; index < arrayList.length; index++) {
        if (textArea.value == arrayList[index]) {
            textArea.value = "Tarefa já existe. Favor adicionar outra"
        }
    }

    if (labelForm.innerText == "Adicionando tarefa" && textArea.value != "Tarefa já existe. Favor adicionar outra") {
        let newTask = {
            description: textArea.value,
            done: false
        }
        tasks.push(newTask)
        createTasks(newTask)
        textArea.value = ""

        localStorage.setItem('tasks', JSON.stringify(tasks))

        document.querySelectorAll(".app__section-task-list-item").forEach(selectLi)
    }

}

cancelFormBtn.addEventListener("click", () => {
    formTask.classList.add("hidden")
    textArea.value = ""
})

deleteFormBtn.addEventListener("click", () => {
    if (labelForm.innerText == "Adicionando tarefa") {
        formTask.classList.add("hidden")
        textArea.value = ""
    }
})

document.querySelectorAll(".app__section-task-list-item").forEach(selectLi)

function selectLi(item) {
    item.getElementsByTagName('p')[0].onclick = () => saveOnAtive(item)
    item.getElementsByTagName('svg')[0].onclick = () => changeSVG(item)
    item.getElementsByTagName('button')[0].onclick = () => editTask(item)
}

function saveOnAtive(item) {
    let taskDescription = item.getElementsByTagName('p')[0].innerHTML
    localStorage.setItem('ative', taskDescription)
    taskAtiveDescription.innerText = localStorage.getItem("ative")
}

function changeSVG(item) {
    item.classList.toggle("app__section-task-list-item-complete")

    if (item.classList == "app__section-task-list-item app__section-task-list-item-complete") {
        for (let index = 0; index < tasks.length; index++) {
            if (tasks[index].description == item.getElementsByTagName('p')[0].innerText) {
                tasks[index].done = true
                localStorage.setItem('tasks', JSON.stringify(tasks))
            }
        }
    }

    if (item.classList == "app__section-task-list-item") {
        for (let index = 0; index < tasks.length; index++) {
            if (tasks[index].description == item.getElementsByTagName('p')[0].innerText) {
                tasks[index].done = false
                localStorage.setItem('tasks', JSON.stringify(tasks))
            }
        }

    }
}

taskAtiveDescription.innerText = localStorage.getItem("ative")

for (let index = 0; index < tasks.length; index++) {

    if (tasks[index].done == true) {
        document.querySelectorAll(".app__section-task-list-item")[index].classList.add("app__section-task-list-item-complete")
    }

}

function editTask(item) {
    item.onclick = editTasks(item)
}

function editTasks(item) {
    formTask.classList.remove("hidden")
    labelForm.innerText = "Editando tarefa"
    formTask.onsubmit = () => editItem(item)

    deleteFormBtn.onclick = () => deleteItem(item)

}

function editItem(item) {
    if (textArea.value != "Tarefa já existe. Favor adicionar outra") {
        for (let index = 0; index < tasks.length; index++) {
            if (tasks[index].description == item.getElementsByTagName('p')[0].innerText) {
                tasks[index].description = textArea.value
                localStorage.setItem('tasks', JSON.stringify(tasks))
            }
        }

        item.getElementsByTagName('p')[0].innerText = textArea.value
    }

}

function deleteItem(item) {

    for (let index = 0; index < tasks.length; index++) {
        if (tasks[index].description == item.getElementsByTagName('p')[0].innerText) {
            tasks.splice(index, 1)
            localStorage.setItem('tasks', JSON.stringify(tasks))
        }
    }

    item.innerHTML = ""
    item.classList.remove("app__section-task-list-item")
    labelForm.innerText = "Adicionando tarefa"
}

deleteDoneTasks.onclick = () => removeDoneTasks()
deleteAllTasks.onclick = () => removeAllTasks()


function removeDoneTasks() {
    for (let index = 0; index < tasks.length; index++) {
        if (tasks[index].done == true) {
            tasks.splice(tasks.findIndex(a => a.description == (tasks[index].description), 1))
            localStorage.setItem('tasks', JSON.stringify(tasks))
            location.reload()
        }
    }
}

function removeAllTasks() {
    for (let index = 0; index < tasks.length; index++) {
            tasks.splice(tasks.findIndex(a => a.description == (tasks[index].description), 1))
            localStorage.setItem('tasks', JSON.stringify(tasks))
            location.reload()
        }
}
