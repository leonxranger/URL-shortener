import geoip from 'geoip-lite';
import useragent from 'express-useragent'

export const CLickData = (req,res,next)=>{

    let ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
    console.log("ip:",ip);

    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    ip = '127.0.0.1';
    }

    const isLocalhost = ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')    || ip.startsWith('172.');
    


    const ua = useragent.parse(req.headers['user-agent']);

    req.CLickData={
        ip,
        device: ua.isMobile?'Mobile':ua.isTablet?'Tablet':'Desktop',
        referrer:req.headers['referer'] || 'Direct',
        timestamp:new Date()

    }


    next();
}