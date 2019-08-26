import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({text, handleClick}) => <button onClick={handleClick}>{text}</button>

const Header = ({text}) => <h2>{text}</h2>

const VoteResults = ({anecdotes, votes}) => {

  // Return most voted anecdote.
  const mostVotedAnecdote = (votes) => {
    let highest = 0
    let picked = -1

    votes.forEach( (value) => {
      if (value > highest) {
        highest = value
      }
    })

    picked = votes.findIndex( e => e === highest )

    if (picked < 0) {
      return 'No votes received'
    }

    return anecdotes[picked]
  }

  return (
    <div>
      <Header text='Anecdote with the most votes' />

      <div>{mostVotedAnecdote(votes)}</div>
    </div>
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(6).fill(0))

  // Vote for an anecdote.
  const voteFor = idx => {
    const newVotes = [...votes]
    newVotes[idx] = newVotes[idx] + 1
    return newVotes
  }

  // Choose a random index other than currently selected index.
  const nextIndex = () => {
    let nextI = selected
    while (nextI === selected) {
      nextI = Math.floor(Math.random() * 6)
    }

    return nextI
  }

  return (
    <div>
      <Header text='Anecdote of the day' />

      {props.anecdotes[selected]}

      <div>
        <Button text='vote' handleClick={() => setVotes(voteFor(selected))} />
        <Button text='next anecdote' handleClick={() => setSelected(nextIndex())} />
      </div>

      <VoteResults anecdotes={props.anecdotes} votes={votes} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)
