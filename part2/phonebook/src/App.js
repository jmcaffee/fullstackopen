import React, { useState, useEffect } from 'react'
import Numbers from './components/Numbers'
import AddPersonForm from './components/AddPersonForm'
import Filter from './components/Filter'
import personService from './services/persons'
import './index.css'

const Notification = ({message, isError}) => {
  if(!message) return null

  console.log(`msg: `, message)
  return (
    <div className={isError ? 'notification error' : 'notification'}>{message}</div>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNum, setNewNum ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ notificationMsg, setNotificationMsg ] = useState('')
  const [ errorMsg, setErrorMsg ] = useState('')

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(people => {
        setPersons(people)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const displayErrorMsg = msg => {
    setErrorMsg(msg)

    setTimeout(() => {
      setErrorMsg(null)
    }, 2000)
  }

  const displayNotification = msg => {
    setNotificationMsg(msg)

    setTimeout(() => {
      setNotificationMsg(null)
    }, 3000)
  }

  const updatePerson = (existingPerson) => {
    if(existingPerson &&
      window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`) ) {
        personService
          .update(existingPerson.id, {...existingPerson, number: newNum})
          .then(updatedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : updatedPerson))
            setNewName('')
            setNewNum('')

            displayNotification('Entry updated')
          })
          .catch(error => {
            displayErrorMsg(`Information of ${existingPerson.name} has already already been removed from server`)
          })
    }
  }

  const addPerson = event => {
    event.preventDefault()

    const existingPerson = persons.find((p) => p.name.toLocaleLowerCase() === newName.toLocaleLowerCase())
    if(existingPerson) {
      updatePerson(existingPerson)
      return
    }

    const newPerson = {
      name: newName,
      number: newNum
    }

    personService
      .create(newPerson)
      .then(thePerson => {
        setPersons(persons.concat(thePerson))
        setNewName('')
        setNewNum('')

        displayNotification('Entry added')
      })
  }

  const handlePersonChange = event => {
    setNewName(event.target.value)
  }

  const handleNumberChange = event => {
    setNewNum(event.target.value)
  }

  const handleFilterChange = event => {
    setNewFilter(event.target.value)
  }

  const filteredPersons = newFilter.length > 0
    ? persons.filter(p => p.name.toLocaleLowerCase().includes(newFilter.toLocaleLowerCase()))
    : persons

  const handleDeletePerson = (thePerson) => {
    const { id, name } = thePerson
    if(window.confirm(`Delete ${name}?`)) {
      personService
        .deletePerson(id)
        .then(response => {
          setPersons(persons.filter( person => person.id !== id ))

          setNotificationMsg('Entry deleted')
          setTimeout(() => {
            setNotificationMsg(null)
            }, 5000)
        })
    } else {
      console.log(`delete confirmation cancelled`)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMsg} isError={true} />
      <Notification message={notificationMsg} />
      <Filter value={newFilter} onFilterChange={handleFilterChange} />

      <h3>Add a new phone number</h3>
      <AddPersonForm name={newName} phone={newNum} onNameChange={handlePersonChange} onPhoneChange={handleNumberChange} onSubmit={addPerson} />

      <h3>Numbers</h3>
      <Numbers people={filteredPersons} onDelete={handleDeletePerson} />
    </div>
  )
}

export default App