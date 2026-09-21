import { useState } from 'react'
import './App.css'

function App() {
  const [counter, setCounter] = useState(5);

  const addValue = () => {
    console.log("clicked", counter);
    setCounter(counter + 1);
  }

  const removeValue = () => {
    setCounter(counter - 1);
  }

  return (
    <>
      <h1>Chai aur code</h1>
      <h2>Counter Value: {counter}</h2>
      <button onClick={addValue}>Add Value</button>
      <br />
      <button onClick={removeValue}>Remove Value</button>
    </>
  )
}

export default App