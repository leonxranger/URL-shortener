import { useState } from 'react'

import { Route, useNavigate } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import './App.css'

  function AppContent(){
    const navigate = useNavigate();
    const Publishable_Key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

    if(!Publishable_Key){
      throw new Error("Missing Publishable Key");
    }

    return(
      <ClerkProvider
        publishableKey={Publishable_Key}
        routerPush={(to) => navigate(to)}
        routerReplace={(to) => navigate(to, { replace: true })} 
      >
      <Routes>
        <Route  path='/' element={<AuthPage/>}></Route>
        <Route></Route>

      </Routes>
    </ClerkProvider>

    )
  }


function App() {

  return (

    <AppContent/>
  )
}

export default App
 