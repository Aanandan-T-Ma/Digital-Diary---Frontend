import React, {Component} from 'react'
import { Nav, NavItem, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, 
        Label, Input, TabContent, TabPane, ModalFooter } from 'reactstrap'
import { SECRET_KEY, USER_NAME } from '../shared/config'
import '../styles/loginStyles.css'

class Login extends Component{
    
    constructor(props){
        super(props);
        this.state={
            isModalOpen: false,
            activeTab: 'login',
            loginShowPass: false,
            showPass: false,
            showConPass: false,
            username: localStorage.getItem(USER_NAME)
        }
        this.toggleModal = this.toggleModal.bind(this)
        this.login = this.login.bind(this)
        this.signup = this.signup.bind(this)
        this.logout = this.logout.bind(this)
    }

    toggleModal(){
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    toggleTab(tab){
        this.setState({
            activeTab: tab
        })
    }

    logout(){
        this.setState({
            username: ''
        })
        localStorage.removeItem(SECRET_KEY)
        localStorage.removeItem(USER_NAME)
        window.location.reload()
    }

    login(event){
        event.preventDefault()
        const user = {
            userId: this.lemail.value,
            password: this.lpassword.value
        }
        fetch('users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
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
            if(response.resCode === 1){
                this.setState({
                    username: response.username
                })
                localStorage.setItem(SECRET_KEY, response.userId)
                localStorage.setItem(USER_NAME, response.username)
                window.location.reload()
            }
            else if(response.resCode === -1){
                alert('Invalid Username/Email!')
            }
            else{
                alert('Invalid Password!')
            }
            console.log(this.state.loggedIn)
        })
        .catch(error => {
            console.log(error.message)
        })
    }

    signup(){}

    loginModal(){
        return (
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader id={this.state.activeTab+"Header"} toggle={this.toggleModal}>
                    <Nav>
                        <NavItem className={(this.state.activeTab === 'login')?'pr-3 font-weight-bold':'pr-3 font-weight-light'} 
                            onClick={() => this.toggleTab('login')}
                            style={{cursor: 'pointer'}}>
                            Login
                        </NavItem>
                        <NavItem className={(this.state.activeTab === 'signup')?'font-weight-bold':'font-weight-light'} 
                            onClick={() => this.toggleTab('signup')}
                            style={{cursor: 'pointer'}}>
                            Sign Up
                        </NavItem>
                    </Nav>
                </ModalHeader>
                <ModalBody id={this.state.activeTab+"Tab"}>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="login">
                            <Form id="loginForm" onSubmit={this.login}>
                                <FormGroup>
                                   <div className="form-row">
                                     <Label htmlFor="lemail" className="col-12 col-sm-3 offset-sm-1">
                                        <span className="fa fa-user"></span> UserId/Email
                                     </Label>
                                     <Input type="text" id="lemail" name="lemail" className="col-12 col-sm-7" 
                                            innerRef={(input) => this.lemail = input} required />
                                   </div> 
                                </FormGroup>
                                <FormGroup>
                                   <div className="form-row">
                                     <Label htmlFor="lpassword" className="col-12 col-sm-3 offset-sm-1">
                                        <span className="fa fa-key"></span> Password
                                     </Label>
                                     <Input type={this.state.loginShowPass? "text":"password" } id="lpassword" name="lpassword" className="col-12 col-sm-7"
                                            innerRef={(input) => this.lpassword = input} required />
                                   </div> 
                                </FormGroup>
                                <FormGroup check>
                                   <div className="form-row">
                                      <Label check className="col-12 offset-sm-4 col-sm-4">
                                        <Input type="checkbox" name="show" checked={this.state.loginShowPass} 
                                            onChange={() => this.setState({ loginShowPass: !this.state.loginShowPass })} />
                                            Show Password
                                      </Label>
                                    </div>
                                </FormGroup>
                            </Form>
                        </TabPane>
                        <TabPane tabId="signup">
                            <Form id="signupForm" onSubmit={this.signup}>
                                <FormGroup>
                                   <div className="form-row">
                                     <Label htmlFor="susername" className="col-12 col-sm-3 offset-sm-1">
                                        <span className="fa fa-user"></span> Username
                                     </Label>
                                     <Input type="text" id="susername" name="susername" className="col-12 col-sm-7" 
                                            innerRef={(input) => this.username = input} required />
                                   </div> 
                                </FormGroup>
                                <FormGroup>
                                   <div className="form-row">
                                     <Label htmlFor="semail" className="col-12 col-sm-3 offset-sm-1">
                                        <span className="fa fa-envelope"></span>  Email
                                     </Label>
                                     <Input type="email" id="semail" name="semail" className="col-12 col-sm-7" 
                                            innerRef={(input) => this.email = input} required />
                                   </div> 
                                </FormGroup>
                                <FormGroup>
                                   <div className="form-row">
                                     <Label htmlFor="spassword" className="col-12 col-sm-3 offset-sm-1">
                                        <span className="fa fa-key"></span> Password
                                     </Label>
                                     <Input type={ this.state.showPass? "text":"password" } id="spassword" name="spassword" className="col-12 col-sm-7"
                                            innerRef={(input) => this.password = input} required />
                                     <span className={ this.state.showPass? "fa fa-eye eye-btn":"fa fa-eye-slash eye-btn" } 
                                        onClick={() => this.setState({ showPass: !this.state.showPass })}>
                                     </span>
                                   </div> 
                                </FormGroup>
                                <FormGroup>
                                   <div className="form-row">
                                     <Label htmlFor="scpassword" className="col-12 col-sm-3 offset-sm-1">
                                        <span className="fa fa-lock"></span> Confirm Password
                                     </Label>
                                     <Input type={this.state.showConPass? "text":"password" } id="scpassword" name="scpassword" className="col-12 col-sm-7"
                                            innerRef={(input) => this.cpassword = input} required />
                                     <span className={ this.state.showConPass? "fa fa-eye eye-btn":"fa fa-eye-slash eye-btn" } 
                                        onClick={() => this.setState({ showConPass: !this.state.showConPass })}>
                                     </span>
                                   </div> 
                                </FormGroup>
                            </Form>
                        </TabPane>
                    </TabContent>
                </ModalBody>
                <ModalFooter id={this.state.activeTab+"Footer"}>
                    <div className="container">
                        <div className="row"> 
                            <div className="col-12 col-sm-4 offset-sm-2">
                                <Button type="submit" className="w-100" color={this.state.activeTab ==="login"?"primary":"success"}
                                    form={this.state.activeTab+"Form"} >
                                    { this.state.activeTab === 'login'? 'Login':'Register' }
                                </Button>
                            </div>
                            <div className="col-12 col-sm-4 offset-sm-1">
                                <Button type="button" className="w-100" onClick={this.toggleModal} color="secondary">Cancel</Button>
                            </div>
                        </div> 
                    </div>
                </ModalFooter>
            </Modal>
        )
    }

    render(){
        return (
            <div>
                { this.state.username? 
                    <div>
                        <span id="username">{ this.state.username }</span>
                        <Button color="primary" onClick={this.logout}><span className="fa fa-sign-out fa-lg"></span> Logout</Button>
                    </div> : 
                    <Button color="primary" onClick={this.toggleModal}><span className="fa fa-sign-in fa-lg"></span> Login</Button> 
                }
                { this.loginModal() }
            </div>
        )
    }
}

export default Login