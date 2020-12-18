import React, {Component} from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavbarToggler, Collapse, Button, Modal, ModalHeader, ModalBody,
     Form, FormGroup, Label, Input, TabContent, TabPane, ModalFooter } from 'reactstrap';
import { NavLink } from 'react-router-dom';    

class Header extends Component{

    constructor(props){
        super(props);
        this.state={
            isNavOpen: false,
            isModalOpen: false,
            activeTab: 'login',
            users: props.users
        }
        this.toggleNav = this.toggleNav.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
        this.login = this.login.bind(this)
        this.signup = this.signup.bind(this)
    }

    toggleNav(){
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }

    toggleModal(){
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    toggle(tab){
        this.setState({
            activeTab: tab
        })
    }

    login(event){
        this.toggleModal()
        var i
        const users = this.state.users
        for(i=0;i<users.length;i++){
            if(this.lusername.value === users[i].username){
                if(this.lpassword.value === users[i].password){
                    localStorage.setItem('userId', users[i].id)
                    alert("Logged in Successfully!")
                }
                else
                    alert("Incorrect Password!")
                break
            }
        }
        if(i === users.length)
            alert("Invalid username!")
        event.preventDefault()
    }

    signup(){}

    loginModal(){
        return (
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader id={this.state.activeTab+"Header"} toggle={this.toggleModal}>
                    <Nav>
                        <NavItem className={(this.state.activeTab === 'login')?'pr-3 font-weight-bold':'pr-3 font-weight-light'} 
                            onClick={() => this.toggle('login')}
                            style={{cursor: 'pointer'}}>
                            Login
                        </NavItem>
                        <NavItem className={(this.state.activeTab === 'signup')?'font-weight-bold':'font-weight-light'} 
                            onClick={() => this.toggle('signup')}
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
                                     <Label htmlFor="lusername" className="col-12 col-sm-3 offset-sm-1">
                                        <span className="fa fa-user"></span> Username
                                     </Label>
                                     <Input type="text" id="lusername" name="lusername" className="col-12 col-sm-7" 
                                            innerRef={(input) => this.lusername = input} required />
                                   </div> 
                                </FormGroup>
                                <FormGroup>
                                   <div className="form-row">
                                     <Label htmlFor="lpassword" className="col-12 col-sm-3 offset-sm-1">
                                        <span className="fa fa-key"></span> Password
                                     </Label>
                                     <Input type="password" id="lpassword" name="lpassword" className="col-12 col-sm-7"
                                            innerRef={(input) => this.lpassword = input} required />
                                   </div> 
                                </FormGroup>
                                <FormGroup check>
                                   <div className="form-row">
                                      <Label check className="col-12 offset-sm-4 col-sm-4">
                                        <Input type="checkbox" name="show" />Show Password
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
                                     <Input type="text" id="semail" name="semail" className="col-12 col-sm-7" 
                                            innerRef={(input) => this.email = input} required />
                                   </div> 
                                </FormGroup>
                                <FormGroup>
                                   <div className="form-row">
                                     <Label htmlFor="spassword" className="col-12 col-sm-3 offset-sm-1">
                                        <span className="fa fa-key"></span> Password
                                     </Label>
                                     <Input type="password" id="spassword" name="spassword" className="col-12 col-sm-7"
                                            innerRef={(input) => this.password = input} required />
                                   </div> 
                                </FormGroup>
                                <FormGroup>
                                   <div className="form-row">
                                     <Label htmlFor="scpassword" className="col-12 col-sm-3 offset-sm-1">
                                        <span className="fa fa-lock"></span> Confirm Password
                                     </Label>
                                     <Input type="password" id="scpassword" name="scpassword" className="col-12 col-sm-7"
                                            innerRef={(input) => this.cpassword = input} required />
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
                                    form="loginForm" >
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
               <Navbar dark expand="md">
                   <div className="container">
                       <NavbarToggler onClick={this.toggleNav} />
                       <NavbarBrand className="mr-auto" href="/">
                           <img src="/images/diary.jpg" width="30" height="40" alt="Diary" />
                       </NavbarBrand>
                       <Collapse isOpen={this.state.isNavOpen} navbar>
                           <Nav navbar>
                               <NavItem>
                                 <NavLink className="nav-link" to="/home"><span className="fa fa-home fa-lg"></span> Home</NavLink>
                               </NavItem>
                               <NavItem>
                                 <NavLink className="nav-link" to="/memories"><span className="fa fa-image fa-lg"></span> Memories</NavLink>
                               </NavItem>
                               <NavItem>
                                 <NavLink className="nav-link" to="/events"><span className="fa fa-calendar fa-lg"></span> Events</NavLink>
                               </NavItem>
                               <NavItem>
                                 <NavLink className="nav-link" to="/todo"><span className="fa fa-list fa-lg"></span> To-Do</NavLink>
                               </NavItem>
                               <NavItem>
                                 <NavLink className="nav-link" to="/contactus"><span className="fa fa-address-card fa-lg"></span> Contact Us</NavLink>
                               </NavItem>
                           </Nav>
                           <Nav navbar className="ml-auto">
                               <NavItem>
                                   <Button color="primary" onClick={this.toggleModal}><span className="fa fa-sign-in fa-lg"></span> Login</Button>
                               </NavItem>
                           </Nav>
                       </Collapse>
                   </div>
               </Navbar>
               { this.loginModal() }
           </div>
       ); 
    }
}

export default Header;