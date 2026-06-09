import React from 'react'
import { useClerk } from '@clerk/clerk-react'
const AnalyticsDashboard = () => {
    const {signOut} = useClerk()
  return (
    <div>
        <button onClick={()=>{signOut()}}>Sign Out</button>
        this is the dashboard
    </div>
  )
}

export default AnalyticsDashboard
