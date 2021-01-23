import React, { Component } from 'react'
import { Form, Input, InputGroup, InputGroupAddon, Button, ListGroupItem, Tooltip } from 'reactstrap'
import '../styles/todoStyles.css'
import Home from './HomeComponent'
import { SECRET_KEY } from '../shared/config'

class Todo extends Component{

    constructor(props){
        super(props)
        this.state = {
            dateInput: "text",
            timeInput: "text",
            tasks: [],
            userId: localStorage.getItem(SECRET_KEY)
        } 
        this.addTask = this.addTask.bind(this)
        this.getTasks = this.getTasks.bind(this)
        this.assignTooltipOpen = this.assignTooltipOpen.bind(this)
        this.toggleTooltip = this.toggleTooltip.bind(this)
    }

    componentDidMount(){
        this.getTasks()
        this.assignTooltipOpen()
    }

    render(){
        if(this.state.userId){
            const Tasks = this.renderTasks()
            return (
                <div className="container fill-empty">
                    <div className="row">
                        <div className="col-12 title">Your Tasks</div>
                    </div>
                    <hr />
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-10">
                          <Form onSubmit={this.addTask}> 
                            <InputGroup>
                              <Input type="text" placeholder="Add Task..." innerRef={(input) => this.task = input} />
                              <Input type={this.state.dateInput} placeholder="Deadline Date" innerRef={(input) => this.deadlineDate = input} 
                                  onFocus={() => this.setState({dateInput: "date"})} onBlur={() => this.setState({dateInput: "text"})} />
                              <Input type={this.state.timeInput} placeholder="Deadline Time" innerRef={(input) => this.deadlineTime = input} 
                                  onFocus={() => this.setState({timeInput: "time"})} onBlur={() => this.setState({timeInput: "text"})} />    
                              <InputGroupAddon addonType="append">
                                  <Button type="submit">Add</Button>
                              </InputGroupAddon>
                            </InputGroup>
                          </Form> 
                        </div>
                    </div>
                    { Tasks }
                </div>
            )
        }
        else return <Home/>
    }

    renderTasks(){
        if(!this.state.tasks){
            return (
                <div></div>
            )
        }
        else{
          const task = this.state.tasks.map((task, index) => {
            return (
                <div key={task._id} className="task">
                    <ListGroupItem color={new Date()>new Date(task.deadline)? "danger":"primary"} style={{textDecoration: task.done?"line-through":"none"}} 
                                   id={'task'+index}   onClick={() => this.markTask(task)}>
                        {task.name}<span className="close" onClick={() => this.deleteTask(task)}>&times;</span>
                    </ListGroupItem> 
                    <Tooltip placement="bottom" isOpen={task.tooltipOpen} target={'task'+index} toggle={() => this.toggleTooltip(task)}
                            popperClassName="tooltip">
                        {this.getDateFormat(task.deadline)}
                    </Tooltip>
                </div>
            )
          })  
          return (
            <div className="task-list">
                { task } 
            </div>
          ) 
        }
    }

    getDateFormat(deadline){
        if(deadline === 'nil') return 'No Deadline'
        let date = new Date(deadline)
        let hrs = date.getHours()
        let mins = date.getMinutes()
        let ap = 'am'
        if(hrs >= 12) ap = 'pm'
        if(hrs > 12) hrs -= 12
        else if(hrs === 0) hrs = 12
        let format = 'Deadline: '+date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()+' '+hrs+':'+(mins?mins:'00')+' '+ap
        if(new Date() > date) format += ' Exceeded!'
        return format
    }

    toggleTooltip(task){
        const index = this.state.tasks.indexOf(task)
        let tasks = this.state.tasks
        tasks[index].tooltipOpen = !tasks[index].tooltipOpen
        this.setState({
            tasks: tasks
        })
    }

    addTask(event){
        if(!this.task.value){
          alert('Task not provided!')
          event.preventDefault() 
        }
        else{
           let inputDate = 'nil' 
           if(this.deadlineDate.value){
                inputDate = new Date(this.deadlineDate.value)
                if(this.deadlineTime.value){
                    inputDate.setMinutes(Number(this.deadlineTime.value.substring(3,5)))
                    inputDate.setHours(Number(this.deadlineTime.value.substring(0,2)))
                }
           }
           const task = {
               userId: this.state.userId,
               name: this.task.value,
               deadline: inputDate
           }
           fetch('/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            })
            .then(response => {
                if(response.ok)
                    return response
                else{
                    var error = new Error('Error ' + response.status + ': ' + response.statusText)
                    error.response = response
                    throw error
                }
            },
            err => {
                var error = new Error(err)
                throw error
            })
            .catch(error => {
                console.log(error.message)
            })
        }
    }
    
    markTask(task){
        var tasks = this.state.tasks
        for(var i=0;i<tasks.length;i++){
            if(tasks[i]===task){
              tasks[i].done = !tasks[i].done
              break
            }
        }
        this.setState({
            tasks: tasks
        })
        fetch('/todos/'+task._id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: this.state.userId, done: task.done})
        })
        .then(response => {
            if(response.ok)
                return response
            else{
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                throw error
            }
        },
        err => {
            var error = new Error(err)
            throw error
        })
        .catch(error => {
            console.log(error.message)
        })
    }

    deleteTask(task){
        var tasks = this.state.tasks
        var i
        for(i=0;i<tasks.length;i++)
          if(tasks[i]===task)
            break
        tasks.splice(i,1)
        this.setState({
            tasks: tasks
        })
        fetch('/todos/'+task._id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: this.state.userId})
        })
        .then(response => {
            if(response.ok)
                return response
            else{
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                throw error
            }
        },
        err => {
            var error = new Error(err)
            throw error
        })
        .catch(error => {
            console.log(error.message)
        })
    }

    assignTooltipOpen(){
        let tasks = this.state.tasks
        for(let i=0;i<tasks.length;i++)
            tasks[i].tooltipOpen = false
        this.setState({
            tasks: tasks
        })
    }

    getTasks(){
        fetch('/todos/all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: this.state.userId})
        })
        .then(response => {
            if(response.ok)
                return response
            else{
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response
                throw error
            }
        },
        err => {
            var error = new Error(err)
            throw error
        })
        .then(response => response.json())
        .then(response => {
            this.setState({
                tasks: response
            })
        })
        .catch(error => {
            console.log(error.message)
        })
    }
}

export default Todo