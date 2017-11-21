import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome'
import faker from 'faker';

import './App.css';
import InfiniteList from "./components/InfiniteList";
import ContactCard from "./components/ContactCard";

export default class App extends Component {


  constructor() {
    super();
    this.itemCount = 1000;
    this.state = {
      contacts: [],
      contentHeight: 0,
    };
  }

  componentDidMount() {
    const contacts = [];
    for (let i = 0; i < this.itemCount; i++) {
      contacts.push({
        id: i + 1,
        avatar: faker.image.avatar(),
        fullName: faker.name.findName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumberFormat(),
        bio: faker.lorem.paragraph(),
      });
    }
    this.setState({ contacts });

    window.addEventListener('resize', () => {this.handleResize()});
    this.handleResize();
  }

  componentWillUnmount(){
    window.removeEventListener('resize', () => {this.handleResize()});
  }

  handleResize() {
    this.setState({contentHeight: window.innerHeight - 153})
  }

  render() {

    const { contacts, contentHeight } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <FontAwesome className="App-logo" name='users' size='5x'/>
          <h1 className="App-title">Contacts</h1>
        </header>
        <div className="App-content" style={{height: contentHeight}}>
          <InfiniteList rowComponent={ContactCard} data={contacts}/>
        </div>
      </div>
    );
  }
}
