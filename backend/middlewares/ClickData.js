import geoip from 'geoip-lite';
import useragent from 'express-useragent'

export const CLickData = (req,res,next)=>{

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip);
    const ua = useragent.parse(req.headers['user-agent']);

    req.CLickData={
        ip,
        country:geo?.country || 'unknown',
        dev ice: ua.isMobile?'Mobile':ua.isTablet?'Tablet':'Desktop',
        browser:ua.browser,
        referrer:req.headers['referer'] || 'Direct',
        timestamp:new Date()

    }


    next();
}