import { total_Clicks ,total_Active,top_performing,distinct_countries } from "../Util/AccountData"


export const accountdata={
    totalClicks:{
        title:'Total Clicks',
        fetch:(obj)=>(total_Clicks(obj.links,obj.clicks)),
         
    },
    ActiveLinks:{
        title:'Active Links',
        fetch:(obj)=>(total_Active(obj.links))
    },
    TopLink:{
        title:'Top Link',
        fetch:(obj)=>(top_performing(obj.links))

    },
    Countries:{
        title:'Countries',
        fetch:(obj)=>(distinct_countries(obj.clicks))
    }
}