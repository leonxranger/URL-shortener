//get total number of clicks
export const total_Clicks = (links, clicks) => {
    const now = new Date();
    const sevendays_ago = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const fourteendays_ago = new Date(now - 14 * 24 * 60 * 60 * 1000);

    const thisweek = clicks.filter(c => new Date(c.timestamp) >= sevendays_ago).length;
    const lastweek = clicks.filter(c => {
        const d = new Date(c.timestamp);
        return d >= fourteendays_ago && d < sevendays_ago;
    }).length;

    const delta = lastweek === 0 ? null : (((thisweek - lastweek) / lastweek) * 100).toFixed(1);

    let text = '';
    let colour = '';

    if (delta === null) {
        text = 'No data last week';
        colour = 'gray-400';
    } else if (delta > 0) {
        text = `+${delta}% this week`;
        colour = 'green-400';
    } else {
        text = `${delta}% this week`;
        colour = 'red-400';
    }

    const data = clicks.length;
    return { data, text, colour };
};

//get the number of active-Links

export const total_Active=(links)=>{
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const links_created_today = links.filter((link)=>(new Date(link.created_at) >= today)).length;
    const data = links.length;

    const text = `${links_created_today} created Today`

    return{text , data , colour:'zinc-400'}

}

//Link that is performing the best(most number of clicks)

export const   top_performing=(links)=>{

    if (!links.length) return { data: 'N/A', text: '0 clicks', colour: 'gray-400' };

    const topLink = links.reduce((max, link) => 
    link.clicks > max.clicks ? link : max
    );
    const data = topLink.longURL.split('/')[2];
    const text=`${topLink.clicks} clicks`

    return {data,text,colour:'green-400'};
 }

//no. of different countries that have clicked links
export const distinct_countries=(clicks)=>{
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    let text='';
    let colour='';
    const thisWeekCountries = new Set(
    clicks
        .filter(c => c.country && new Date(c.timestamp) >= startOfWeek)
        .map(c => c.country)
    );

    const countryCount = new Set(clicks.map(c => c.country)).size;
     
    const data=countryCount;
    if(thisWeekCountries.size == 0){
        text=''
        colour='';
    }else if(thisWeekCountries.size > 0){
        text=`+${thisWeekCountries.size} this week`
        colour='green-400';
        
    }else{
        text=`-${thisWeekCountries.size} this week`
        colour='red-400';
    }
    return {text,data,colour};
} 