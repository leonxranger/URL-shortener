import { total_Clicks ,total_Active,top_performing,distinct_countries } from "../Util/AccountData"
import { SquareMousePointer,Activity,Podium,Globe } from "lucide-react"

export const accountdata={
    totalClicks:{
        title:'Total Clicks',
        fetch:(obj)=>(total_Clicks(obj.links,obj.clicks)),
        svg:<SquareMousePointer/>,
         
    },
    ActiveLinks:{
        title:'Active Links',
        fetch:(obj)=>(total_Active(obj.links)),
        svg:<Activity />
    },
    TopLink:{
        title:'Top Link',
        fetch:(obj)=>(top_performing(obj.links)),
        svg:<Podium />

    },
    Countries:{
        title:'Countries',
        fetch:(obj)=>(distinct_countries(obj.clicks)),
        svg:<Globe />
    }
}