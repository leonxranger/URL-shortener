import { useState } from 'react'

import { Route, useNavigate } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import Links from './pages/Links.jsx'
import './App.css'
import DashboardLayout from './pages/DashboardLayout.jsx'
import AnalyticsDashboard from './Components/AnalyticsDashboard.jsx'
import LinkwiseStats from './Components/LinkWiseStats.jsx'

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
      <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<AnalyticsDashboard/>} />
              <Route path="/links" element={<Links/>} />
              <Route path='/analytics' element={<LinkwiseStats/>}/>
            </Route>        <Route 
          path="/sso-callback" 
          element={
            <AuthenticateWithRedirectCallback 
              signInForceRedirectUrl="/dashboard" 
              signUpForceRedirectUrl="/dashboard" 
            />
          }/>
          
   
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
 