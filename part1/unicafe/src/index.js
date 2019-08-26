import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Header = ({text}) => <h2>{text}</h2>

const Button = ({text, handleClick}) => <button onClick={handleClick}>{text}</button>

const Statistic = ({text, value}) => <tr><td>{text}</td><td>{value}</td></tr>

const Statistics = ({good, neutral, bad}) => {
  const all = () => good + neutral + bad
  const avg = () => (good - bad) / all()
  const pos = () => good / all()

  if (all() === 0) {
    return (
      <div>
        <Header text='statistics' />

        <p>
          No feedback given
        </p>
      </div>
    )
  }

  return (
    <div>
      <Header text='statistics' />

      <table>
        <tbody>
          <Statistic text='good' value={good} />
          <Statistic text='neutral' value={neutral} />
          <Statistic text='bad' value={bad} />
          <Statistic text='all' value={all()} />
          <Statistic text='average' value={avg()} />
          <Statistic text='positive' value={pos()} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // Save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  return (
    <div>
      <Header text='give feedback' />

      <Button text='good' handleClick={() => setGood(good + 1)} />
      <Button text='neutral' handleClick={() => setNeutral(neutral + 1)} />
      <Button text='bad' handleClick={() => setBad(bad + 1)} />

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
