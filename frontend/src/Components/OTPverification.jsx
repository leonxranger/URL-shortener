import React, { useRef, useState } from 'react'

const OTPverification = ({onComplete,cooldown ,onReSend }) => {

    const [otp , setotp ] = useState(Array(6).fill(''));
    const refs = useRef([])


    const handelChange=(i,val)=>{
        if(!/^\d?$/.test(val)) return;

        const updated =[...otp];

        updated[i] =val;

        setotp(updated);

        if(val && i<5)refs.current[i+1].focus();

        if(updated.every(d=>d))onComplete(updated.join(''))
    }

    const handelkeyDown=(i,e)=>{
        if(e.key === 'Backspace' && !otp[i] && i>0){
            refs.current[i-1].focus();
        }
    }


    const handelPaste=(e)=>{
            const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
            if(!pasted){
                return;
            }

            const updated = Array(6).fill('').map((_,i)=>pasted[i] || '');
            setotp(updated);
            refs.current[Math.min(pasted.length, 5)].focus()
            if (pasted.length === 6) onComplete(pasted)
    }

    return(
        <>

        <div className='h-full bg-yellow-400 flex items-center justify-center ' onPaste={handelPaste}>



            <div className='flex flex-col w-[1/2] h-1[20%] p-10  bg-white rounded-xl shadow-2xl items-start gap-7 justify- z-20'>
            <div>
                <h1 className='text-3xl font-primary tracking-wide'>
                        Verification Code
                </h1>
                <p>Enter verification code that was sent to your desired email</p>
            </div>


                <div className='flex flex-row gap-4'>
                    {
                        otp.map((digit,i)=>(
                            <input
                            key={i}
                            ref={el=>refs.current[i] = el}
                            value={digit}
                            onChange={e=>handelChange(i,e.target.value)}
                            onKeyDown={e=>handelkeyDown(i,e)}
                            maxLength={1}
                            inputMode='numeric'
                                className={`
                                    w-12 h-14 text-center text-xl z-20 font-semibold rounded-xl border-2
                                    bg-[#fafafa] text-[#0d0d0d] outline-none transition-all duration-150
                                    ${digit
                                    ? 'border-[#c0392b] bg-white shadow-[0_0_0_3px_rgba(192,57,43,0.1)]'
                                    : 'border-[#e0e0e0]'
                                    }
                                    focus:border-[#c0392b] focus:bg-white focus:shadow-[0_0_0_3px_rgba(192,57,43,0.1)]
                                `}
                                >
                            
                            
                            
                            
                            </input>
                        ))
                    }
                </div>
                    <h1>Didn't receive an otp? {' '}   {cooldown > 0
                    ? <span className="text-[#bbb]">Resend in {cooldown}s</span>
                    : <span 
                        onClick={onReSend}
                        className="text-[#0d0d0d] font-semibold hover:underline cursor-pointer"
                    >
                        Resend
                    </span>
                }   </h1>
            </div>

        </div>
        </>
    )


}

export default OTPverification
