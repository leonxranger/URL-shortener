const Patterns = [
    {name:"X/Twitter" , regex:/twitter|x\.com|t\.co/i},
    {name:"Google" , regex:/google/i},
    {name:"Reddit",regex:/reddit/i},
    {name:"LinkedIn " , regex:/LinkedIn/i}
]

export const BucketReferrer=(raw)=>{
    raw = raw.toString().toLowerCase();
    if(!raw || raw === 'direct' || raw === '')return "Direct";

    const match = Patterns.find(p=>p.regex.test(raw));

    return match?match.name:"Other"
    
}