import React, { Component } from 'react'
import { Button, UncontrolledPopover, PopoverHeader, PopoverBody, Form, 
         Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { months } from '../shared/names'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import Home from './HomeComponent'
import { SECRET_KEY } from '../shared/config'
import '../styles/eventStyles.css'

class Events extends Component {

    constructor(props){
        super(props)
        this.state = {
            events: [],
            curMonth: new Date().getMonth(),
            curYear: new Date().getFullYear(),
            modalEvent: {},
            editMode: false,
            addMode: false,
            userId: localStorage.getItem(SECRET_KEY)
        }
        this.next = this.next.bind(this)
        this.prev = this.prev.bind(this)
        this.toggleEdit = this.toggleEdit.bind(this)
        this.toggleAdd = this.toggleAdd.bind(this)
        this.togglePopover = this.togglePopover.bind(this)
        this.editEvent = this.editEvent.bind(this)
        this.addEvent = this.addEvent.bind(this)
        this.getEvents = this.getEvents.bind(this)
        this.assignPopoverOpen = this.assignPopoverOpen.bind(this)
    }

    componentDidMount(){
        this.getEvents()
        this.assignPopoverOpen()
    }

    render(){
        if(this.state.userId){
            return (
                <div className="container">
                    { this.editModal() }
                    { this.addModal() }
                    <div className="pb-4">
                    { this.renderEvents() }
                    </div>
                </div>
            )
        }
        else return <Home/>
    }

    monthStructure(){
        const day = new Date(this.state.curYear, this.state.curMonth, 1).getDay()
        var matrix = [], week = []
        for(var i=0;i<day;i++) week.push(' ')
        var curDate = 1, lastDate = new Date(this.state.curYear, this.state.curMonth+1, 0).getDate()
        while(curDate <= lastDate){
            week.push(curDate++)
            if(week.length === 7){
                matrix.push(week)
                week = []
            }
        }
        if(week.length){ 
            while(week.length<7) week.push(' ')
            matrix.push(week)
        }
        return matrix
    }

    next(){
        if(this.state.curMonth === 11){
          this.setState({
              curYear: this.state.curYear+1
          })
        }
        this.setState({
            curMonth: (this.state.curMonth+1)%12
        })
    }

    prev(){
        if(this.state.curMonth === 0){
          this.setState({
              curYear: this.state.curYear-1
          })
        }
        this.setState({
            curMonth: (this.state.curMonth+11)%12
        })
    }

    toggleEdit(){
        this.setState({
            editMode: !this.state.editMode
        })
    }
    
    toggleAdd(){
        this.setState({
            addMode: !this.state.addMode
        })
    }

    togglePopover(event){
        const index = this.state.events.indexOf(event)
        var events = this.state.events
        events[index].popoverOpen = !events[index].popoverOpen
        this.setState({
            events: events
        })
    }

    openModal(event){
        this.setState({
            modalEvent: event,
            editMode: !this.state.editMode
        })
    }

    addEvent(event){
        if(!this.etitle.value){
          alert('Title is empty!')
          event.preventDefault()
        }
        else if(!this.edate.value){
          alert('Date is empty!')
          event.preventDefault()
        }
        else{
            const evt = {
              userId: this.state.userId,
              title: this.etitle.value,
              date: this.edate.value,
              time: this.etime.value,
              description: this.edesc.value,
              once: this.etype.value === 'once'
            }
            fetch('/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(evt)
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

    deleteEvent(event){
        confirmAlert({
          title: "'"+event.title+"'",
          message: 'Are you sure to delete this Event?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => {
                    fetch('/events/'+event._id, {
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
                    window.location.reload()
              }
            },
            {
              label: 'No',
              onClick: () => {}
            }
          ] 
        })
    }

    editEvent(event){
        if(!this.etitle.value){
          alert('Title is empty!')
          event.preventDefault()
        }
        else if(!this.edate.value){
          alert('Date is empty!')
          event.preventDefault()
        }
        else{
            const evt = {
                userId: this.state.userId,
                title: this.etitle.value,
                date: this.edate.value,
                time: this.etime.value,
                description: this.edesc.value,
                once: this.etype.value === 'once'
            }
            fetch('/events/'+this.state.modalEvent._id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(evt)
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

    addModal(){
        return (
            <Modal isOpen={this.state.addMode} toggle={this.toggleAdd}>
                <ModalHeader toggle={this.toggleAdd} className="eventAddHeader" cssModule={{'modal-title': 'w-100 text-center'}}>New Event</ModalHeader>
                <ModalBody className="eventAddBody">
                    <Form id="addForm" onSubmit={this.addEvent}>
                        <div className="form-row pt-3">
                            <Label htmlFor="etitle" className="col-12 col-sm-2 offset-sm-1">Title</Label>
                            <Input type="text" id="etitle" name="etitle" className="col-12 col-sm-7"  
                               innerRef={(input) => this.etitle = input} />
                        </div>
                        <div className="form-row pt-3">
                            <Label htmlFor="edate" className="col-12 col-sm-2 offset-sm-1">Date</Label>
                            <Input type="date" id="edate" name="edate" className="col-12 col-sm-7" 
                              innerRef={(input) => this.edate = input} />
                        </div>
                        <div className="form-row pt-3">
                            <Label htmlFor="etime" className="col-12 col-sm-2 offset-sm-1">Time</Label>
                            <Input type="time" id="etime" name="etime" className="col-12 col-sm-7" 
                              innerRef={(input) => this.etime = input} />
                        </div>
                        <div className="form-row pt-3">
                            <Label htmlFor="etype" className="col-12 col-sm-2 offset-sm-1">Event Type</Label>
                            <Input type="select" name="etype" id="etype" className="col-12 col-sm-7"  
                              innerRef={(input) => this.etype = input}>
                                <option value="once">Only Once</option>
                                <option value="regular">Regular</option>
                            </Input>
                        </div>
                        <div className="form-row pt-3">
                            <Label htmlFor="edesc" className="col-12 col-sm-2 offset-sm-1">Description</Label>
                            <Input type="textarea" id="edesc" name="edesc" className="col-12 offset-sm-1 col-sm-9" rows="10" 
                              innerRef={(input) => this.edesc = input} />
                        </div>
                    </Form>
                </ModalBody>
                <ModalFooter className="eventAddFooter">
                  <div className="container">  
                    <div className="row">
                      <div className="col-4 offset-1">
                        <Button color="primary" style={{width: '100%', fontSize: '20px'}} type="submit" form="addForm">
                            Save <span className="fa fa-save"></span>
                        </Button>
                      </div>
                      <div className="col-4 offset-1">
                        <Button color="secondary" style={{width: '100%', fontSize: '20px'}} onClick={this.toggleAdd}>Cancel</Button>
                      </div>  
                    </div>
                  </div>  
                </ModalFooter>
            </Modal>
        )
    }

    editModal(){
        const event = this.state.modalEvent
        return (
            <Modal isOpen={this.state.editMode} toggle={this.toggleEdit}>
                <ModalHeader toggle={this.toggleEdit} className="eventEditHeader" cssModule={{'modal-title': 'w-100 text-center'}}>Edit Event</ModalHeader>
                <ModalBody className="eventEditBody">
                    <Form id="editForm" onSubmit={this.editEvent}>
                        <div className="form-row pt-3">
                            <Label htmlFor="etitle" className="col-12 col-sm-2 offset-sm-1">Title</Label>
                            <Input type="text" id="etitle" name="etitle" className="col-12 col-sm-7" defaultValue={event.title}  
                               innerRef={(input) => this.etitle = input} />
                        </div>
                        <div className="form-row pt-3">
                            <Label htmlFor="edate" className="col-12 col-sm-2 offset-sm-1">Date</Label>
                            <Input type="date" id="edate" name="edate" className="col-12 col-sm-7" defaultValue={event.date} 
                              innerRef={(input) => this.edate = input} />
                        </div>
                        <div className="form-row pt-3">
                            <Label htmlFor="etime" className="col-12 col-sm-2 offset-sm-1">Time</Label>
                            <Input type="time" id="etime" name="etime" className="col-12 col-sm-7" defaultValue={event.time} 
                              innerRef={(input) => this.etime = input} />
                        </div>
                        <div className="form-row pt-3">
                            <Label htmlFor="etype" className="col-12 col-sm-2 offset-sm-1">Event Type</Label>
                            <Input type="select" name="etype" id="etype" className="col-12 col-sm-7" defaultValue={event.once? 'once':'regular'} 
                              innerRef={(input) => this.etype = input}>
                                <option value="once">Only Once</option>
                                <option value="regular">Regular</option>
                            </Input>
                        </div>
                        <div className="form-row pt-3">
                            <Label htmlFor="edesc" className="col-12 col-sm-2 offset-sm-1">Description</Label>
                            <Input type="textarea" id="edesc" name="edesc" className="col-12 offset-sm-1 col-sm-9" rows="10" defaultValue={event.description} 
                              innerRef={(input) => this.edesc = input} />
                        </div>
                    </Form>
                </ModalBody>
                <ModalFooter className="eventEditFooter">
                  <div className="container">  
                    <div className="row">
                      <div className="col-4 offset-1">
                        <Button color="primary" style={{width: '100%', fontSize: '20px'}} type="submit" form="editForm">
                            Save <span className="fa fa-save"></span>
                        </Button>
                      </div>
                      <div className="col-4 offset-1">
                        <Button color="secondary" style={{width: '100%', fontSize: '20px'}} onClick={this.toggleEdit}>Cancel</Button>
                      </div>  
                    </div>
                  </div>  
                </ModalFooter>
            </Modal>
        )
    }

    renderEvents(){
        const monthStruct = this.monthStructure()
        const wantedEvents = this.state.events.filter((event) => {
            return Number(event.date.substring(5,7)) === this.state.curMonth+1 && (!event.once || Number(event.date.substring(0,4)) === this.state.curYear)
        })
        const monthMat = monthStruct.map((week) => {
            const days = week.map((day) => {
                const evts = wantedEvents.filter((event) => {
                    return Number(event.date.substring(8,10)) === day
                })
                const events = evts.map((evt) => {
                    var time = ""
                    if(evt.time){
                        var h = Number(evt.time.substring(0,2)), ap = " PM"
                        if(h<12) ap = " AM"
                        if(!h) h = 12
                        else if(h>12) h -= 12
                        time = h + evt.time.substring(2,5) + ap
                    }
                    return (
                        <div style={{cursor: "pointer"}} id={"event"+evt._id}>
                            { time+" "+evt.title }
                            <UncontrolledPopover trigger="legacy" isOpen={evt.popoverOpen} toggle={() => this.togglePopover(evt)}
                                        placement="bottom" target={"event"+evt._id}>
                                <PopoverHeader className="popheader">{evt.title}</PopoverHeader>
                                <PopoverBody className="popbody">
                                    <div className="pt-1 pb-2">
                                        {evt.description}
                                    </div>
                                    <div className="d-flex justify-content-around">
                                      <Button color="primary" onClick={() => {this.togglePopover(evt); this.openModal(evt)}}>Edit <span className="fa fa-edit"></span></Button>
                                      <Button color="danger" onClick={() => {this.togglePopover(evt); this.deleteEvent(evt)}}>Delete <span className="fa fa-trash"></span></Button>
                                    </div>
                                </PopoverBody>
                            </UncontrolledPopover>
                        </div>
                    )
                })
                var color = "#66ccff"
                const d = new Date()
                if(this.state.curYear === d.getFullYear() && this.state.curMonth === d.getMonth() && day === d.getDate())
                   color = "#00ff99"
                else if(day === ' ')
                   color = "#aaaaaa"
                return (
                    <td style={{backgroundColor: color}}>
                        <div className="daycell">
                            {day}
                        </div>
                        <div className="eventcell">
                            {events}
                        </div>
                    </td>
                )
            })
            return (
                <tr>{days}</tr>
            )
        })
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <Button color="primary" className="m-3" onClick={this.toggleAdd}>New Event <span className="fa fa-plus-square"></span></Button>
                </div>
                <div className="row">
                    <table id="calendar">
                    <thead>  
                        <tr style={{backgroundColor: '#0011ff'}}>
                            <th colSpan="7">
                                <Button color="primary" style={{float: 'left'}} onClick={this.prev}><span className="fa fa-chevron-left"></span></Button>
                                <span id="month">{ months[this.state.curMonth]+" "+this.state.curYear }</span>
                                <Button color="primary" style={{float: 'right'}} onClick={this.next}><span className="fa fa-chevron-right"></span></Button>
                            </th>
                        </tr>
                        <tr style={{backgroundColor: '#0099cc'}}>
                            <th>Sun</th>
                            <th>Mon</th>
                            <th>Tue</th>
                            <th>Wed</th>
                            <th>Thu</th>
                            <th>Fri</th>
                            <th>Sat</th>
                        </tr>
                    </thead>  
                    <tbody>
                        {monthMat}
                    </tbody>
                    </table>
                </div>
            </div>
        )
    }

    getEvents(){
        fetch('/events/all', {
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
                events: response
            })
        })
        .catch(error => {
            console.log(error.message)
        })
    }

    assignPopoverOpen(){
        var events = this.state.events
        for(var i=0;i<events.length;i++)
            events[i].popoverOpen = false
        this.setState({
            events: events
        })
    }
}

export default Events;