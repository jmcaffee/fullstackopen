import React from 'react'

const Person = ({person, onDelete}) => <div>{person.name} {person.number} <button onClick={() => onDelete(person)} >delete</button></div>

const People = ({people, onDelete}) => (
  <div>
    {people.map((person) => <Person key={person.name} person={person} onDelete={onDelete}/>)}
  </div>)

const Numbers = ({people, onDelete}) => <People people={people} onDelete={onDelete} />

export default Numbers