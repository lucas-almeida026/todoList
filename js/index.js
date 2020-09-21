const setMasterInLocalStorage = (key, value) => !!key && !!value ? localStorage.setItem(key, value) : false
const getMasterInLocalStorage = () => {return {...JSON.parse(localStorage.getItem('todoTasks#0927'))}} 
const updateMasterInLocalStorage = state => localStorage.setItem('todoTasks#0927', state)

const createTaskElements = tasks => {
    return resp = !!tasks ? tasks.map(e => console.log(e)) : false
}

function Task(name){
    const setNextId = stateTasks => (parseInt(stateTasks[stateTasks.length - 1].id) + 1).toString()
    this.id = !!getMasterInLocalStorage().tasks.length >= 1 ? setNextId(getMasterInLocalStorage().tasks) : '1'
    return {name, id: this.id}
}

const renderTasks = tasks => {
    console.log(createTaskElements())
}

const updateState = (state, stateKey, newValue) => {
    let dicFunctions = [
        ['tasks', () => {
            state.tasks.push(newValue)
            return newState = {...state}
        }],
        ['colorTheme', () => state = {...state, colorTheme: newValue}]
    ]
    let newLocalStore = JSON.stringify(Object.fromEntries(dicFunctions)[stateKey]())
    return !!state[stateKey] ? localStorage.setItem('todoTasks#0927', newLocalStore) : false
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
        if(e.key == 'Enter'){
            console.log(new Task(phantomTaskInput.value))
            updateState(state, 'tasks', new Task(phantomTaskInput.value))
            phantomTaskInput.value = ''
        }
    })
})