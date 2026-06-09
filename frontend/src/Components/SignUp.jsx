import React from 'react'
import Google from '../assets/Google.png'
import Github from '../assets/Github.png'
import logo_white from '../assets/logo-white-mode.png'
import { useState } from 'react'
import { Eye, EyeClosed, Star } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useSignUp } from '@clerk/clerk-react'
import {useNavigate} from 'react-router'
import OTPverification from './OTPverification'

const SignUp = ({mode,onSwitch}) => {
      const [isPassword, changeToPassword] = useState(false)
          const [email , setemail]=useState('');
          const [password , setpassword] = useState('');
          const [pendingVerification , setpendingVerification] = useState(false);
          const [cooldown, setCooldown] = useState(0)

          const navigate = useNavigate();



  const ProviderObject = {
    google: { src: Google, auth: '', label: 'Google' },
    github: { src: Github, auth: '', label: 'GitHub' },
  } 

  const {isLoaded , signUp , setActive} = useSignUp();


  const verification=async(original_otp)=>{

    if(!isLoaded)return;

    try{
      const toastID = toast.loading('verifying OTP . . .');

      const attempSignup = await signUp.attemptEmailAddressVerification({code: original_otp});

      if(attempSignup.status === 'complete'){
        toast.success('Successfully Signed Up!', { id: toastID })
        await setActive({session:attempSignup.createdSessionId});
        navigate('/dashboard')
      } 


    }catch(err){
        toast.error(err)
    } 
  }

  const HandelSignUp=async()=>{
    try{
      const result = await signUp.create({emailAddress:email,
        password,
      });

      const otp_send = await signUp.prepareEmailAddressVerification({strategy:'email_code'});
      toast.success('Verification code sent to your email!');
      setpendingVerification(true);

    }catch(error){
      const errorMessage = error.errors?.[0]?.longMessage || 'Failed to sign up';
      toast.error(errorMessage);
      console.log(error);
    }
  }

  
  const handleResend = async () => {
  try {
    await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
    toast.success('New code sent!')
    
    // 30 second cooldown
    setCooldown(30)
    const interval = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
  } catch (err) {
    toast.error(err.errors?.[0]?.message || 'Failed to resend')
  }
}


  if(pendingVerification){
          toast.success('Verification code sent to your email!');

    return(
      <>
      <Toaster position="top-center" reverseOrder={false} />

      <OTPverification onComplete={verification} cooldown={cooldown} onReSend={handleResend}/>
      </>
    ) 
  }else{
  return (
          <div className="relative z-20  flex justify-center items-center h-full px-6 py-10 overflow-y-auto">
                      <Toaster position="top-center" reverseOrder={false} />

            <div className="bg-white border border-[#e5e5e5] rounded-2xl shadow-[0_8px_48px_rgba(0,0,0,0.10)] px-8 py-9 w-full max-w-[420px] flex flex-col gap-6">

              <div className="anim-fade-up-1">
                <img src={logo_white} alt="ZipLink" className="h-10 w-auto object-contain self-start" />
              </div>

              <div className="anim-fade-up-2 flex flex-col gap-1">
                <h1 className="font-primary text-[#0d0d0d] text-4xl font-semibold tracking-wide">Create an account</h1>
                <p className="text-[#999] text-sm leading-relaxed">Join thousands shortening links with analytics.</p>
              </div>

              <div className="anim-fade-up-3 flex flex-col gap-1.5">
                <label className="text-[#555] text-sm font-medium">Email</label>
                <input
                  onChange={(e)=>setemail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-10 bg-[#fafafa] border border-[#e0e0e0] rounded-lg px-3 text-sm text-[#0d0d0d] placeholder-[#ccc] transition-all focus:border-[#c0392b] focus:ring-2 focus:ring-[#c0392b]/10 focus:bg-white"
                />
              </div>

              <div className="anim-fade-up-3 flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[#555] text-sm font-medium">Password</label>
                  <span className="text-xs text-[#bbb] hover:text-[#c0392b] cursor-pointer transition-colors">Forgot password?</span>
                </div>
                <div className="relative">
                  <input
                    onChange={(e)=>setpassword(e.target.value)}
                    type={isPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    className="w-full h-10 bg-[#fafafa] border border-[#e0e0e0] rounded-lg px-3 pr-10 text-sm text-[#0d0d0d] placeholder-[#ccc] transition-all focus:border-[#c0392b] focus:ring-2 focus:ring-[#c0392b]/10 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => changeToPassword(!isPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#888] transition-colors"
                  >
                    {isPassword ? <Eye size={15} /> : <EyeClosed size={15} />}
                  </button>

                  <div id="clerk-captcha"></div>

                </div>
              </div>

              <div className="anim-fade-up-4">
                <button 
                
                onClick={()=>HandelSignUp()}
                className="w-full h-10 bg-[#0d0d0d] text-white text-sm font-medium rounded-lg hover:opacity-85 active:scale-[0.98] transition-all cursor-pointer">
                  Get started
                </button>
              </div>

              <div className="anim-fade-up-4 flex items-center gap-3">
                <div className="flex-1 h-px bg-[#eee]" />
                <span className="text-xs text-[#bbb]">or continue with</span>
                <div className="flex-1 h-px bg-[#eee]" />
              </div>

              <div className="anim-fade-up-5 flex gap-3">
                {Object.entries(ProviderObject).map(([name, provider]) => (
                  <button
                    key={name}
                    type="button"
                    className="flex-1 h-10 bg-white border border-[#e5e5e5] rounded-lg flex items-center justify-center gap-2 hover:bg-[#f7f7f7] hover:border-[#d0d0d0] active:scale-[0.97] transition-all cursor-pointer"
                  >
                    <img src={provider.src} alt={provider.label} className="h-4 w-4 object-contain" />
                    <span className="text-sm text-[#555]">{provider.label}</span>
                  </button>
                ))}
              </div>

              <p className="anim-fade-up-5 text-center text-xs text-[#bbb]">
                Already have an account?{' '}
                <a  className="text-[#0d0d0d] hover:cursor-pointer font-semibold hover:underline" onClick={onSwitch}>Sign in</a>
              </p>

            </div>
          </div>
  )
  }
}

export default SignUp
