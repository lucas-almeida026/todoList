const setMasterInLocalStorage = (key, value) => !!key && !!value ? localStorage.setItem(key, value) : false
const getMasterInLocalStorage = () => {return {...JSON.parse(localStorage.getItem('todoTasks#0927'))}} 
const updateMasterInLocalStorage = state => localStorage.setItem('todoTasks#0927', state)

const createTaskElements = tasks => {
    return resp = !!tasks ? tasks.map(e => console.log(e)) : false
}

function Task(name){
    this.id = !!getMasterInLocalStorage().tasks.length ? false : '1'
    return {name, id: this.id}
}

const renderTasks = tasks => {
    console.log(createTaskElements())
}

const updateState = (state, stateKey, newValue) => {
    let dicFunctions = [
        ['tasks', () => state = {...state, tasks: newValue}],
        ['colorTheme', () => state = {...state, colorTheme: newValue}]
    ]
    return !!state[stateKey] ? Object.fromEntries(dicFunctions)[stateKey]() : false
}

window.addEventListener('DOMContentLoaded', () => {
    !!localStorage.getItem('todoTasks#0927') ? false : setMasterInLocalStorage('todoTasks#0927', JSON.stringify({
        tasks: [],
        colorTheme: 'original'
    }))
    const state = getMasterInLocalStorage()
    console.log(state)
    renderTasks(state.tasks)
    let phantomTaskInput = document.getElementById('phantomTaskInput')
    phantomTaskInput.addEventListener('focusout', () => phantomTaskInput.value = '')
    phantomTaskInput.addEventListener('keypress', e => {
        const submitEvent = () => {
            localStorage.setItem('todoTasks#0927', JSON.stringify(updateState(state, 'tasks', new Task(phantomTaskInput.value))))
        }
        e.key == 'Enter' ? submitEvent() : false
    })
})