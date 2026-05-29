import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
    <div className='flex flex-col items-center gap-10'> 
    <h1>URL shortener</h1>
    <input className='h-10 w-100 bg-zinc-400 rounded-xl text-black text-center' placeholder='Enter your URL here'></input>

    <button className='bg-indigo-400 h-10 w-30 rounded-xl text-amber-50 hover:cursor-pointer hover:opacity-75'>Generate</button>

    </div>

    </>
  )
}

export default App
