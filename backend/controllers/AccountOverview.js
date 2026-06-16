import { CLICKS } from "../models/Clicks.js";
import { LINK } from "../models/Link.js";

export const OverallStats = async(req,res)=>{

    const {id} = req.params;
    console.log("user-id" , id)
    //all links by the connected USER
    const links = await LINK.find({userID:id})
    

    const activeLinks = links.filter((link)=>new Date(link.expiration_date) > new Date())

    const total_Links = links.length;

    const linkIds = links.map(l=>l._id.toString());

    const clicks = await CLICKS.find({urlID: {$in:linkIds}});

    //list of all the expired links 

    const expiredLinks = links.filter(l => new Date(l.expiration_date) < new Date());

  
    const deviceBreakdown = clicks.reduce((acc, c) => {
    acc[c.device] = (acc[c.device] || 0) + 1;
    return acc;
  }, {});

  const countryBreakdown = clicks.reduce((acc, c) => {
    acc[c.country] = (acc[c.country] || 0) + 1;
    return acc;
  }, {});

  const browserBreakdown = clicks.reduce((acc, c) => {
    acc[c.browser] = (acc[c.browser] || 0) + 1;
    return acc;
  }, {});


  const result={
    clicks:clicks,
    links:links, 
    activeLinks:activeLinks,
    total_Links:total_Links,
    expiredLinks:expiredLinks,
    deviceBreakdown:deviceBreakdown,
    countryBreakdown:countryBreakdown,
    browserBreakdown:browserBreakdown,
  }

  return res.status(200).json(result)
 
}