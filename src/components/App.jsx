import React, { Component } from 'react';
import { nanoid } from 'nanoid';
import { Container } from './Container/Container';
import { ContactForm } from './ContactForm/ContactForm';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList';
import styles from './app.module.css';

export class App extends Component {
  state = {
    contacts: [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ],

    filter: '',
  };

  addContact = ({ name, number }) => {
    const newContact = {
      id: nanoid(),
      name,
      number,
    };

    this.state.contacts.filter(
      contact =>
        contact.name.toLowerCase().trim() ===
          newContact.name.toLowerCase().trim() ||
        contact.number.trim() === newContact.number.trim()
    ).length
      ? alert(`${newContact.name}: is already in contacts`)
      : this.setState(({ contacts }) => {
          return {
            contacts: [newContact, ...contacts],
          };
        });
  };

  changeFilter = event => {
    this.setState({ filter: event.currentTarget.value });
  };

  filterContacts = () => {
    const { contacts, filter } = this.state;

    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  deleteContact = id => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== id),
    }));
  };

  componentDidMount() {
    console.log('App componentDidMount');
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('App componentDidUpdate');
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  render() {
    const { filter } = this.state;
    const filteredResults = this.filterContacts();

    return (
      <Container>
        <h1 className={styles.title}>Phonebook</h1>
        <ContactForm onSubmit={this.addContact} />
        <h2 className={styles.title}>Contacts</h2>
        <Filter value={filter} onChange={this.changeFilter} />
        <ContactList
          contacts={filteredResults}
          onDeleteContact={this.deleteContact}
        />
      </Container>
    );
  }
}
