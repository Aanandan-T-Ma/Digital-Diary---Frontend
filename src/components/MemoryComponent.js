import React, { Component } from 'react'
import { Button, Card, CardBody, CardImg, CardSubtitle, CardTitle, 
         Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { months } from '../shared/names'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import Home from './HomeComponent'
import { SECRET_KEY } from '../shared/config'

class Memories extends Component{
    constructor(props){
        super(props)
        this.state = {
            memories: [],
            modal: false,
            modalMemory: {},
            editMode: false,
            addMode: false,
            userId: localStorage.getItem(SECRET_KEY)
        }
        this.toggleModal = this.toggleModal.bind(this)
        this.toggleEdit = this.toggleEdit.bind(this)
        this.toggleAdd = this.toggleAdd.bind(this)
        this.editMemory = this.editMemory.bind(this)
        this.addMemory = this.addMemory.bind(this)
        this.getMemories = this.getMemories.bind(this)
    }

    componentDidMount(){
        this.getMemories()
    }

    render(){
        if(this.state.userId){
            return (
                <div className="container fill-empty">
                    { this.memoryModal() }
                    { this.editModal() }
                    { this.addModal() }
                    { this.renderMemories() } 
                </div>
            )
        }
        else return <Home/>
    }

    toggleModal(){
        this.setState({
            modal: !this.state.modal
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

    formatDate(date,type){
        if(type === 0)
          return String(date.getDate()).padStart(2,'0')+"/"+String(date.getMonth()+1).padStart(2,'0')+"/"+date.getFullYear()
        else{
          var suf = "th"
          const d = date.getDate()
          if(d%10 === 1) suf = "st"
          else if(d%10 === 2) suf = "nd"
          else if(d%10 === 3) suf = "rd"
          return (
              <div>{d}<sup>{suf}</sup>{" "+months[date.getMonth()]+", "+date.getFullYear()}</div>
          )
        }
    }

    getImage(date){
        return "images/"+months[date.getMonth()].substring(0,3).toLowerCase()+".jpg"
    }

    viewMemory(memory){
        this.setState({
            modalMemory: memory,
            modal: !this.state.modal
        })
    }

    addMemory(event){
        if(!this.mtitle.value){
          alert('Title is empty!')
          event.preventDefault()
        }
        else if(!this.mdate.value){
          alert('Date is empty!')
          event.preventDefault()
        }
        else if(!this.mdesc.value){
          alert('Description is empty!')
          event.preventDefault()
        }
        else if(new Date(this.mdate.value) > new Date()){
          alert('Invalid Date!')
          event.preventDefault()
        }
        else{
           const memory = {
              userId: this.state.userId,
              title: this.mtitle.value,
              date: this.mdate.value,
              description: this.mdesc.value
           }
           fetch('/memories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(memory)
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

    editMemory(event){
        if(!this.mtitle.value){
          alert('Title is empty!')
          event.preventDefault()
        }
        else if(!this.mdate.value){
          alert('Date is empty!')
          event.preventDefault()
        }
        else if(!this.mdesc.value){
          alert('Description is empty!')
          event.preventDefault()
        }
        else if(new Date(this.mdate.value) > new Date()){
          alert('Invalid Date!')
          event.preventDefault()
        }
        else{
            const memory = {
                userId: this.state.userId,
                title: this.mtitle.value,
                date: this.mdate.value,
                description: this.mdesc.value
            }
            fetch('/memories/'+this.state.modalMemory._id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(memory)
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

    deleteMemory(memory){
        confirmAlert({
          title: "'"+memory.title+"'",
          message: 'Are you sure to delete this Memory?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => {
                    fetch('/memories/'+memory._id, {
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

    groupMemories(){
        if(this.state.memories.length === 0) 
            return []
        var memories = this.state.memories
        memories.sort((m1, m2) => { return new Date(m1.date) - new Date(m2.date) })
        var date = new Date(memories[memories.length-1].date)
        var y = date.getFullYear(), m = date.getMonth()
        var mems = [] 
        var mem = []
        for(var i=memories.length-1;i>=0;i--){
            date = new Date(memories[i].date)
            if(date.getFullYear() !== y || date.getMonth() !== m){
                mems.push(mem)
                mem = [memories[i]]
                y = date.getFullYear()
                m = date.getMonth()
            }
            else
              mem.push(memories[i])
        }
        mems.push(mem)
        return mems
    }

    addModal(){
        return (
            <Modal isOpen={this.state.addMode} toggle={this.toggleAdd}>
                <ModalHeader toggle={this.toggleAdd} className="addHeader" cssModule={{'modal-title': 'w-100 text-center'}}>New Memory</ModalHeader>
                <ModalBody className="addBody">
                    <Form id="addForm" onSubmit={this.addMemory}>
                        <div className="form-row pt-3">
                            <Label htmlFor="mtitle" className="col-12 col-sm-2 offset-sm-1">Title</Label>
                            <Input type="text" id="mtitle" name="mtitle" className="col-12 col-sm-7" 
                              innerRef={(input) => this.mtitle = input} />
                        </div>
                        <div className="form-row pt-3">
                            <Label htmlFor="mdate" className="col-12 col-sm-2 offset-sm-1">Date</Label>
                            <Input type="date" id="mdate" name="mdate" className="col-12 col-sm-7" 
                              innerRef={(input) => this.mdate = input} />
                        </div>
                        <div className="form-row pt-3">
                            <Label htmlFor="mdesc" className="col-12 col-sm-2 offset-sm-1">Description</Label>
                            <Input type="textarea" id="mdesc" name="mdesc" className="col-12 offset-sm-1 col-sm-9" rows="10" 
                              innerRef={(input) => this.mdesc = input} />
                        </div>
                    </Form>
                </ModalBody>
                <ModalFooter className="addFooter">
                  <div className="container">  
                    <div className="row">
                      <div className="col-4 offset-1">
                        <Button color="primary" style={{width: '100%', fontSize: '20px'}} form="addForm" type="submit">
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
        const memory = this.state.modalMemory
        return (
            <Modal isOpen={this.state.editMode} toggle={this.toggleEdit}>
                <ModalHeader toggle={this.toggleEdit} className="editHeader" cssModule={{'modal-title': 'w-100 text-center'}}>Edit Memory</ModalHeader>
                <ModalBody className="editBody">
                    <Form id="editForm" onSubmit={this.editMemory}>
                        <div className="form-row pt-3">
                            <Label htmlFor="mtitle" className="col-12 col-sm-2 offset-sm-1">Title</Label>
                            <Input type="text" id="mtitle" name="mtitle" className="col-12 col-sm-7" defaultValue={memory.title}  
                               innerRef={(input) => this.mtitle = input} />
                        </div>
                        <div className="form-row pt-3">
                            <Label htmlFor="mdate" className="col-12 col-sm-2 offset-sm-1">Date</Label>
                            <Input type="date" id="mdate" name="mdate" className="col-12 col-sm-7" defaultValue={memory.date} 
                              innerRef={(input) => this.mdate = input} />
                        </div>
                        <div className="form-row pt-3">
                            <Label htmlFor="mdesc" className="col-12 col-sm-2 offset-sm-1">Description</Label>
                            <Input type="textarea" id="mdesc" name="mdesc" className="col-12 offset-sm-1 col-sm-9" rows="10" defaultValue={memory.description} 
                              innerRef={(input) => this.mdesc = input} />
                        </div>
                    </Form>
                </ModalBody>
                <ModalFooter className="editFooter">
                  <div className="container">  
                    <div className="row">
                      <div className="col-4 offset-1">
                        <Button color="primary" style={{width: '100%', fontSize: '20px'}} form="editForm" type="submit">
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

    memoryModal(){
        const memory = this.state.modalMemory
        return (
            <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal} className="modalHeader" cssModule={{'modal-title': 'w-100 text-center'}}>{memory.title}</ModalHeader>
                <ModalBody className="modalBody">
                    <div className="container">
                        <div className="row">
                            <div className="ml-auto">{this.formatDate(new Date(memory.date),1)}</div>
                        </div>
                        <div className="row pt-4">
                            <div className="col-12">
                                <p>{memory.description}</p>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="modalFooter">
                  <div className="container">  
                    <div className="row">
                      <div className="col-4 offset-4">
                        <Button color="primary" style={{width: '100%', fontSize: '20px'}} onClick={() => {this.toggleModal();this.toggleEdit()}}>
                            Edit <span className="fa fa-edit"></span>
                        </Button>
                      </div>  
                    </div>
                  </div>  
                </ModalFooter>
            </Modal>
        )
    }

    renderMemories(){
        if(!this.state.memories)
          return (<div></div>)
        else{
            const memGroup = this.groupMemories()
            const memories = memGroup.map((memory) => {
                const mem = memory.map((mem) => {
                    const d = new Date(mem.date)
                    const date = this.formatDate(d,0)
                    const img = this.getImage(d)
                    return (
                        <div key={mem.id} className="col-12 col-sm-6 col-md-3" style={{display: "inline-block", paddingTop:"20px"}}>
                            <Card style={{borderWidth:"2.5px", cursor: "pointer"}} className="h-100">
                                <CardImg top width="100%" height="260px" src={img} onClick={() => this.viewMemory(mem)}></CardImg>
                                <CardBody>
                                    <CardTitle tag="h4" onClick={() => this.viewMemory(mem)}>{mem.title}</CardTitle>
                                    <CardSubtitle>
                                        <span onClick={() => this.viewMemory(mem)}>{date}</span>
                                        <Button className="float-right btn-sm btn-danger" onClick={() => this.deleteMemory(mem)}>
                                            <span className="fa fa-trash"></span>
                                        </Button>
                                    </CardSubtitle>
                                </CardBody>
                            </Card>
                        </div>
                    )
                })
                var date = new Date(memory[0].date)
                const legend = months[date.getMonth()]+" "+date.getFullYear()
                return (
                    <div className="row" style={{padding: "10px 0px 50px 0px"}}>
                        <legend style={{textAlign: "center", borderBottom: "2px ridge", borderTop: "2px ridge" }}>{legend}</legend>
                        { mem }
                    </div>
                )
            })
            return (
                <div>
                    <div className="row justify-content-center">
                        <Button color="primary" className="mt-3 mb-3" onClick={this.toggleAdd}>New Memory <span className="fa fa-plus-square"></span></Button>
                    </div>
                    {memories}
                </div>
            )
        }  
    }

    getMemories(){
        fetch('/memories/all', {
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
                memories: response
            })
        })
        .catch(error => {
            console.log(error.message)
        })
    }
}

export default Memories;