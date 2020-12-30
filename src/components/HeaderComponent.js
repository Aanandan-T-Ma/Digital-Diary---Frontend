import React, {Component} from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavbarToggler, Collapse } from 'reactstrap';
import { NavLink } from 'react-router-dom';    
import Login from './LoginComponent';

class Header extends Component{

    constructor(props){
        super(props);
        this.state={
            isNavOpen: false
        }
        this.toggleNav = this.toggleNav.bind(this)
    }

    toggleNav(){
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
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
                                   <Login />
                               </NavItem>
                           </Nav>
                       </Collapse>
                   </div>
               </Navbar>
           </div>
       ); 
    }
}

export default Header;