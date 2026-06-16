import toast from "react-hot-toast";
import { useSignIn } from "@clerk/clerk-react";


export const handelsocialLogin=(provider ,isLoaded ,clerkAuth )=>{

    if(!isLoaded){
        return;
    }

    const formattedname = provider.charAt(0).toUpperCase() + provider.slice(1);

    toast.loading("Redirecting to " + formattedname);

    clerkAuth.authenticateWithRedirect({
        strategy:`oauth_${provider}`,
        redirectUrl:'/sso-callback',
        redirectUrlComplete:'/dashboard'
    })

}