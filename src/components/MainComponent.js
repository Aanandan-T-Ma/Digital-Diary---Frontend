import React, {Component} from 'react'
import Header from './HeaderComponent'
import Footer from './FooterComponent'
import Home from './HomeComponent'
import Memories from './MemoryComponent'
import Events  from  './EventComponent'
import Todo from './TodoComponent'
import Contact from './ContactComponent'
import { Switch, Route, Redirect } from 'react-router-dom'
import { tasks } from '../shared/tasks'

class Main extends Component {

    render(){
        return(
            <>
                <Header />
                <Switch>
                    <Route path="/home" component={() => <Home />} />
                    <Route path="/memories" component={() => <Memories />} />
                    <Route path="/events" component={() => <Events />} />
                    <Route path="/todo" component={() => <Todo tasks={tasks} />} />
                    <Route path="/contactus" component={() => <Contact />} />
                    <Redirect to="/home" />
                </Switch>
                <Footer />
            </>
        )
    }
}

export default Main