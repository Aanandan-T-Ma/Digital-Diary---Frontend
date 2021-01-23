import React, { Component } from 'react'
import { Form, Input, InputGroup, InputGroupAddon, Button, ListGroupItem } from 'reactstrap'
import '../styles/todoStyles.css'

class Todo extends Component{

    constructor(props){
        super(props)
        this.state = {
            dateInput: "text",
            timeInput: "text",
            tasks: props.tasks
        } 
        this.addTask = this.addTask.bind(this)
    }

    render(){
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

    renderTasks(){
        if(!this.state.tasks){
            return (
                <div></div>
            )
        }
        else{
          const task = this.state.tasks.map((task) => {
            return (
                <div key={task.id} className="task" title={new Date()>new Date(task.deadline)? "Deadline exceeded":"Deadline: "+task.deadline}>
                    <ListGroupItem color={new Date()>new Date(task.deadline)? "danger":"primary"} style={{textDecoration: task.done?"line-through":"none"}} 
                                   onClick={() => this.markTask(task)}>
                        {task.name}<span className="close" onClick={() => this.deleteTask(task)}>&times;</span>
                    </ListGroupItem> 
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

    addTask(event){
        if(!this.task.value)
          alert('Task not provided!')
        else if(!this.deadlineDate.value)
          alert('Deadline Date not provided!')
        else if(!this.deadlineTime.value)
          alert('Deadline Time not provided!')
        else{
           const inputDate = new Date(this.deadlineDate.value)
           inputDate.setMinutes(Number(this.deadlineTime.value.substring(3,5)))
           inputDate.setHours(Number(this.deadlineTime.value.substring(0,2)))
           const task = {
               id: this.props.tasks.length,
               name: this.task.value,
               deadline: inputDate,
               done: false
           }
           const added = this.state.tasks
           added.push(task) 
           this.setState({
               tasks: added
           })
           console.log(this.state.tasks)
        }    
        event.preventDefault() 
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
    }
}

export default Todo