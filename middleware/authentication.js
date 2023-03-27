const jwt =require("jsonwebtoken")

const {createClient}=require('redis')
const myclient =createClient();
myclient.on('error', err=> console.log('Client Error', err));
myclient.connect();

const authentication = async (req,res,next) =>{
    const token = await myclient.get('token')
    if(token){
        try {
            const data= await myclient.lRange('Arr',0,-1)

            if(data.includes(token)){
                res.status(400).send('login first')
            }else{

                const decoded=jwt.verify(token,"normaltoken")
                if(decoded){
                    req.body.id = decoded.id
                    next()
                }else{
                    res.send("Please Login First")
                }
            }
        } catch (error) {
            console.log(error)
            res.send("Token Expire...")
        }
    }else{
        res.send("Please Login First")
    }
}

module.exports={
    authentication
}