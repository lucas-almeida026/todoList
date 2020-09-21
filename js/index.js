const setMasterInLocalStorage = (key, value) => !!key && !!value ? localStorage.setItem(key, value) : false
const getMasterInLocalStorage = () => JSON.parse(localStorage.getItem('todoTasks#0927'))
const updateMasterLocalStorage = (target, value) => {
    console.log(target, value)
}

const createTaskElements = tasks => {
    return resp = !!tasks ? tasks.map(e => console.log(e)) : false
}

function Task(name){
    this.id = !!getMasterInLocalStorage().tasks.length ? false : '1'
    return {name, id: this.id}
}

const addTask = task => {
    getMasterInLocalStorage().tasks.push(task)
}

const renderTasks = tasks => {
    console.log(createTaskElements())
}

window.addEventListener('DOMContentLoaded', () => {
    const masterTodoList = !!localStorage.getItem('todoTasks#0927') ? getMasterInLocalStorage() : setMasterInLocalStorage('todoTasks#0927', JSON.stringify({
        tasks: [],
        colorTheme: 'original'
    }))
    renderTasks(masterTodoList.tasks)
    let phantomTaskInput = document.getElementById('phantomTaskInput')
    phantomTaskInput.addEventListener('focusout', () => phantomTaskInput.value = '')
    phantomTaskInput.addEventListener('keypress', e => {
        const submitEvent = () => addTask(new Task(phantomTaskInput.value))
        e.key == 'Enter' ? submitEvent() : false
    })
})