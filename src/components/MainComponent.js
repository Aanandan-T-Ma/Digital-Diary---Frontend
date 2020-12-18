import React, {Component} from 'react';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import Memories from './MemoryComponent';
import Events  from  './EventComponent';
import Todo from './TodoComponent';
import Contact from './ContactComponent';
import { Switch, Route, Redirect } from 'react-router-dom';
import { tasks } from '../shared/tasks';
import { memories } from '../shared/memories'
import { events } from '../shared/events'
import { users } from '../shared/users'

class Main extends Component {

    render(){
        return(
            <>
                <Header {...this.props} users={users} />
                <Switch>
                    <Route path="/home" component={() => <Home />} />
                    <Route path="/memories" component={() => <Memories memories={memories} />} />
                    <Route path="/events" component={() => <Events events={events} />} />
                    <Route path="/todo" component={() => <Todo tasks={tasks} />} />
                    <Route path="/contactus" component={() => <Contact />} />
                    <Redirect to="/home" />
                </Switch>
                <Footer />
            </>
        );
    }
}

export default Main;