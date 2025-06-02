import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('response from API:', data);
      document.querySelector('.resposne').innerHTML = `<p>Response from API: ${data.receivedMessage} <br> ${data.dbData.data} </p>`;
    } catch (error) {
      console.error('Error during API request:', error);
    }
  }
  const handleIdQuery = async (event) => {
    event.preventDefault();
    const id = document.querySelector('.id-input').value;
    try {
      const response = await fetch(`/api/test/test/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('response from API:', data);
      document.querySelector('.resposne').innerHTML = `<p>Response from API for ID ${id}: ${data.dbData.data} </p>`;
    } catch (error) {
      console.error('Error during API request:', error);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button type="button" className="reset" onClick={() => setCount(0)}>
          Reset
        </button>
        <button type="submit" onClick={handleSubmit}>
          Test api proxy
        </button>
        <div className="idQuery">
          <form onSubmit={handleIdQuery}>
            <label htmlFor="id">Enter ID to query:</label>
            <input type="text" className="id-input" id="id" name="id" required />
            <button type="submit">Query by ID</button>
          </form>
        </div>

        <div className="resposne">

        </div>


        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
