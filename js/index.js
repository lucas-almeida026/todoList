const encode = id => (id * 7).toString(16) + (id * 140).toString(16).substring(0, 2)
const decode = encodedId => (parseInt('0x' + encodedId.substring(0, encodedId.length - 2)) / 7).toString()

const getTaskById = taskId => {
    console.log(taskId)
}

const deleteTask = taskId => {
    console.log(taskId)
}

const editTask = taskId => {
    console.log(taskId)
}

const checkTask = taskId => {
    decodedId = decode(taskId.substring(taskId.indexOf('_') + 1, taskId.length))
    getTaskById(decodedId)
}

const createTaskElements = tasks => {
    return !!tasks ? tasks.map(e => {
        let task = document.createElement('div')
        let checkBox = document.createElement('div')
        let inputTextName = document.createElement('input')
        let options = document.createElement('div')
        let btnEdit = document.createElement('div')
        let btnDelete = document.createElement('div')
        btnEdit.classList.add('option')        
        btnEdit.id = 'edit_' + encode(e.id)
        btnEdit.innerHTML = '<i class="material-icons materialOptions">edit</i>'
        btnEdit.onclick = e => editTask(e.target.tagName == 'I' ? e.target.parentNode.id : e.target.id)
        btnDelete.classList.add('option')
        btnDelete.id = 'delete_' + encode(e.id)
        btnDelete.innerHTML = '<i class="material-icons materialOptions">delete</i>'
        btnDelete.onclick = e => deleteTask(e.target.tagName == 'I' ? e.target.parentNode.id : e.target.id)
        options.classList.add('options')
        options.append(btnEdit)
        options.append(btnDelete)
        inputTextName.type = 'text'
        inputTextName.value = e.name
        inputTextName.readOnly = true
        checkBox.id = 'chk_' + encode(e.id)
        checkBox.classList.add('checkBox')
        checkBox.onclick = e => checkTask(e.target.id)
        e.finished ? checkBox.classList.add('checked') : false
        task.classList.add('task')
        task.id = 'task_' + encode(e.id)
        task.append(checkBox)
        task.append(inputTextName)
        task.append(options)
        return task
    }) : false
}

function Task(name){
    this.name = name
    const tasks = localStorage.getItem('tasks')
    if(!!tasks.length == false){
        this.id = '1'
    }else{
        nextId = tasks.split(';')
        .reduce((acm, curr, i, arr) => 
        acm = (i == arr.length - 1 ? (parseInt(JSON.parse(curr).id) + 1).toString() : '-1'), '-1')
        this.id = nextId != -1 ? nextId : console.log('Erro ao gerar próximo id')
    }
    this.finished = false
}

const removeTasks = () => {
    const tasksRendered = document.getElementById('taskList').children
    let ids = []
    for(let i = 0; i < tasksRendered.length; i++){
        i > 0 ?
        ids.push(tasksRendered[i].id) : false
    }
    ids.forEach(id => {
        document.getElementById(id).remove()
    })
}

const renderTasks = async tasks => {
    removeTasks()
    const list = document.getElementById('taskList')
    const normalizedTasks = tasks.length > 0 ? tasks.split(';')
    .map(e => JSON.parse(e)) : false

    const arrayElements = createTaskElements(normalizedTasks)
    if(!!arrayElements){
        for(el of arrayElements){
            list.append(el)
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    !!localStorage.getItem('tasks') ? false : localStorage.setItem('tasks', '')
    !!localStorage.getItem('colorTheme') ? false : localStorage.setItem('colorTheme', 'original')

    renderTasks(localStorage.getItem('tasks'))
    let phantomTaskInput = document.getElementById('phantomTaskInput')
    phantomTaskInput.addEventListener('focusout', () => phantomTaskInput.value = '')
    phantomTaskInput.addEventListener('keypress', e => {
        if(phantomTaskInput.value.length < 40){
            if(e.key == 'Enter' && phantomTaskInput.value != ''){
                new Task(phantomTaskInput.value.trim())
                if(localStorage.getItem('tasks').length == 0)              
                    localStorage.setItem('tasks', JSON.stringify(new Task(phantomTaskInput.value.trim())))
                else
                    localStorage.setItem('tasks', [localStorage.getItem('tasks') + ';' + JSON.stringify(new Task(phantomTaskInput.value.trim()))])
                phantomTaskInput.value = ''
                renderTasks(localStorage.getItem('tasks'))            
            }
        }else{
            alert('nome muito grande')
        }
    })
})