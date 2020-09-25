const encode = id => (id * 7).toString(16) + (id * 140).toString(16).substring(0, 2)
const decode = encodedId => (parseInt('0x' + encodedId.substring(0, encodedId.length - 2)) / 7).toString()

const getTaskById = taskId => localStorage.getItem('tasks').split(';').map(e => JSON.parse(e)).filter(e => e.id == taskId)[0]
const updateTasks = (task, change) => {
    const tasks = localStorage.getItem('tasks')
    const lefting = tasks.split(';').map(e => JSON.parse(e)).filter(e => e.id < task.id)
    const righting = tasks.split(';').map(e => JSON.parse(e)).filter(e => e.id > task.id)
    change(task)
    localStorage.setItem('tasks', [...lefting, task, ...righting].map(e => JSON.stringify(e)).join(';'))
}

const deleteTask = taskId => {
    decodedId = decode(taskId.substring(taskId.indexOf('_') + 1, taskId.length))
    const thisTask = getTaskById(decodedId)
    const tasks = localStorage.getItem('tasks')
    const lefting = tasks.split(';').map(e => JSON.parse(e)).filter(e => e.id < thisTask.id)
    const righting = tasks.split(';').map(e => JSON.parse(e)).filter(e => e.id > thisTask.id)
    localStorage.setItem('tasks', [...lefting, ...righting].map(e => JSON.stringify(e)).join(';'))
    renderTasks(localStorage.getItem('tasks')) 
}

const editTask = taskId => {
    decodedId = decode(taskId.substring(taskId.indexOf('_') + 1, taskId.length))
    const thisTask = getTaskById(decodedId)
    const input = document.getElementById('input_' + taskId.substring(taskId.indexOf('_') + 1, taskId.length))
    input.readOnly = false
    input.select()
    input.addEventListener('keypress', e => {
        if(input.value.length < 40){
            if(e.key == 'Enter' && input.value != ''){
                updateTasks(thisTask, t => t.name = input.value.trim())
                renderTasks(localStorage.getItem('tasks'))            
            }
        }else{
            alert('nome muito grande')
        }
    })    
}

const checkTask = taskId => {
    decodedId = decode(taskId.substring(taskId.indexOf('_') + 1, taskId.length))
    const thisTask = getTaskById(decodedId)
    thisTask.finished ? updateTasks(thisTask, t => t.finished = false) : updateTasks(thisTask, t => {t.finished = true})
    renderTasks(localStorage.getItem('tasks')) 
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
        btnEdit.innerHTML = '<i class="material-icons materialOptions '+ localStorage.getItem('colorTheme') +'Material">edit</i>'
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
        inputTextName.id = 'input_' + encode(e.id)

        checkBox.id = 'chk_' + encode(e.id)
        checkBox.classList.add('checkBox')
        e.finished ? checkBox.innerHTML = '<i class="material-icons materialOptions">check_box</i>' : checkBox.innerHTML = '<i class="material-icons materialOptions">check_box_outline_blank</i>'
        e.finished ? checkBox.classList.add('checked') : false
        checkBox.onclick = () => checkTask(checkBox.id)

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
    renderColorTheme(localStorage.getItem('colorTheme'))
}

const renderColorTheme = theme => {
    const body = document.getElementsByTagName('body')[0]
    const header = document.getElementsByTagName('header')[0]
    const optionButtons = document.getElementsByClassName('option')
    const menuItems = document.getElementsByClassName('menuItem')
    const checkBoxes = document.getElementsByClassName('checkBox')
    body.classList.add(theme + 'Bg')
    header.classList.add(theme + 'Bg')
    for(btn of optionButtons){
        !!btn.children[0].classList.item(2) ? btn.children[0].classList.remove(btn.children[0].classList.item(2)) : false
        btn.children[0].classList.add(theme + 'Material')     
    }

    for(btn of menuItems){
        btn.classList.item(1) ? btn.classList.remove(btn.classList.item(1)) : false
        btn.id.substring(6, btn.id.length).toLowerCase() == theme ? btn.classList.add('selectedTheme') : false
    }
    
    for(chk of checkBoxes){
        !!chk.children[0].classList.item(2) ? chk.children[0].classList.remove(chk.children[0].classList.item(2)) : false
        chk.children[0].classList.add(theme + 'Material')
    } 
    !!body.classList.item(1) ? body.classList.remove(body.classList.item(0)) : false
    !!header.classList.item(1) ? header.classList.remove(header.classList.item(0)) : false
}



window.addEventListener('DOMContentLoaded', () => {
    !!localStorage.getItem('tasks') ? false : localStorage.setItem('tasks', '')
    !!localStorage.getItem('colorTheme') ? false : localStorage.setItem('colorTheme', 'original')

    renderTasks(localStorage.getItem('tasks'))
    renderColorTheme(localStorage.getItem('colorTheme'))

    const btnsThemeColor = document.getElementsByClassName('menuItem')
    for(let i = 0; i < btnsThemeColor.length; i++){
        const thisBtn = document.getElementById(btnsThemeColor[i].id)
        thisBtn.onclick = () => {
            const theme = thisBtn.id.substring(6, thisBtn.id.length).toLowerCase()
            localStorage.setItem('colorTheme', theme)
            renderColorTheme(localStorage.getItem('colorTheme'))
        }
    }

    let phantomTaskInput = document.getElementById('phantomTaskInput')
    phantomTaskInput.addEventListener('focusout', () => phantomTaskInput.value = '')
    phantomTaskInput.addEventListener('keypress', e => {
        if(phantomTaskInput.value.length < 40){
            if(e.key == 'Enter' && phantomTaskInput.value != ''){
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