export const GenerateShortCode=(length = 6)=>{
    const BASE62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let shortcode = "";
    for( let i=0;i < length ;i++){
        const randomIndex = Math.floor(Math.random() * 62);
        shortcode+= BASE62[randomIndex];
    }

    return shortcode;

}