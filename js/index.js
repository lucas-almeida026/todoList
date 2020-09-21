const encode = id => parseInt((id * 23), 16).toString()
const decode = encodedId => (parseInt(encodedId, 10) / 21).toString()

const createTaskElements = tasks => {
    return !!tasks ? tasks.map(e => {
        let task = document.createElement('div')
        let checkBox = document.createElement('div')
        let inputTextName = document.createElement('input')
        let options = document.createElement('div')
        let btnEdit = document.createElement('div')
        let btnDelete = document.createElement('div')
        btnEdit.classList.add('option')
        btnEdit.innerHTML = '<i class="material-icons materialOptions">edit</i>'
        btnDelete.classList.add('option')
        btnDelete.id = 'edit_' + encode(e.id)
        btnDelete.innerHTML = '<i class="material-icons materialOptions">delete</i>'
        options.classList.add('options')
        btnEdit.id = 'delete_' + encode(e.id)
        options.append(btnEdit)
        options.append(btnDelete)
        inputTextName.type = 'text'
        inputTextName.value = e.name
        inputTextName.readOnly = true
        checkBox.classList.add('checkBox')
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
    console.log(!!localStorage.getItem('tasks').length)
    if(!!localStorage.getItem('tasks').length == false){
        this.id = '1'
    }else{
        this.id = (parseInt(JSON.parse(localStorage.getItem('tasks')
        .split(';')[0]).id) + 1)
        .toString()
    }
    this.finished = false
    return {name, id: this.id, finished: this.finished}
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
    const normalizedTasks = tasks.split(';')
    .filter((_, i, arr) => i < arr.length - 1)
    .map(e => JSON.parse(e))

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
        if (phantomTaskInput.value.length < 40){
            if(e.key == 'Enter' && phantomTaskInput.value != ''){
                localStorage.setItem('tasks', [JSON.stringify(new Task(phantomTaskInput.value.trim())) + ';' +localStorage.getItem('tasks')])
                phantomTaskInput.value = ''
                renderTasks(localStorage.getItem('tasks'))            
            }
        }else{
            alert('nome muito grande')
        }
    })
})