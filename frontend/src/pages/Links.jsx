import React from 'react'
import ActiveLinks from '../Components/ActiveLinks'
import { useUser ,useClerk} from '@clerk/clerk-react';;
import { useAccountOverview } from '../hooks/useLinks';
import { SidebarContent } from '../Components/Sidebar';
const Links = () => {
        const { user } = useUser();
    const { data, isPending } = useAccountOverview(user?.id);
    const {signOut} = useClerk();

  return (
    <>
    <div className='flex h-full w-full '>

        <ActiveLinks  ActiveLinks={data?.links} isLoading={isPending}/>

    </div>

    </>
  )
}

export default Links
