import {useQuery, useMutation, } from '@tanstack/react-query'
import { URLapi } from '../Util/Axios'

//API check
 


export const APICheck=()=>{
    return useQuery({
         queryFn:async()=>{
            const res = await URLapi.get('/');
            console.log(res.data);
            return res.data.message
         },
    })

}


export const GenerateShortUrl=( )=>{
    const result = useMutation({
        mutationFn:async (url)=>{
            const res = await URLapi.post('/urls',{longURL:url});
            return res.data.URL
        }
    })

    return result;
};


export const linkWiseAnalytics=(id)=>{
    const result = useQuery({
        queryFn:async()=>{
            const res = await URLapi.get(`/urls/${id}/analytics`);
            return res.data.Data;
        }
    })
}

export const userURls=(id)=>{
      const result = useQuery({
        queryFn:async()=>{
            const res = await URLapi.get(`/urls/${id}`);
            return res.data.data;
        }
    })  
}

export const useAccountOverview=(id)=>{
    console.log("id",id)
      const result = useQuery({
        queryKey: ['account-overview', id],
        queryFn:async()=>{
             try{
                    const res = await URLapi.get(`/account-Overview/${id}`);
                    console.log("result:",res);
                    return res.data
            }catch(err){
                console.log(err)
            }

        },
        enabled: !!id
    })  

    return result;
}


export const deleteUrl=(id)=>{
        const result = useMutation({
        mutationFn:async ()=>{
            const res = await URLapi.delete('/urls/id');
            return res.data.URL
        }
    })

    return result;
}