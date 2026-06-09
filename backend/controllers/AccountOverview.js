import { CLICKS } from "../models/Clicks";
import { LINK } from "../models/Link";

export const OverallStats = async(req,res)=>{
    const {id} = req.params();
    //all links by the connected USER
    const links = await LINK.find({userID:id});

    const total_Links = links.length();

    const linkIds = links.map(l=>l._id.toString());

    const clicks = await CLICKS.find({urlID: {$in:linkIds}});

    //list of all the expired links 

    const expiredLinks = links.filter(l => new Date(l.expiration_date)> new Date());


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




}